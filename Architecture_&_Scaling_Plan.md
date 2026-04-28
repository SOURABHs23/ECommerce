# Application — Architecture & Scaling Plan

> **Author:** Sourabh Garg  
> **Date:** April 21, 2026  
> **Status:** Current Architecture + Proposed Kubernetes Migration

---

## 1. Current Architecture (Docker Compose)

We run **2 custom Docker images** and **1 database image** — all on a **single EC2 instance** (1 node).

```mermaid
graph TB
    subgraph "Single EC2 Instance (1 Node)"
        subgraph "Docker Compose"
            FE["🌐 Frontend Container<br/><b>Angular + Nginx</b><br/>Port 80<br/>Image: sourabhs34/ecommerce-frontend"]
            BE["⚙️ Backend Container<br/><b>Spring Boot (Java 21)</b><br/>Port 8080<br/>Image: sourabhs34/ecommerce-backend"]
            DB["🗄️ Database Container<br/><b>PostgreSQL 16</b><br/>Port 5432<br/>Image: postgres:16-alpine"]
        end
    end

    USER["👤 User Browser"] -->|"HTTP :80"| FE
    FE -->|"Nginx reverse proxy<br/>/api/* → backend:8080"| BE
    BE -->|"JDBC<br/>db:5432"| DB

    style FE fill:#4FC3F7,stroke:#0277BD,color:#000
    style BE fill:#81C784,stroke:#2E7D32,color:#000
    style DB fill:#FFB74D,stroke:#E65100,color:#000
    style USER fill:#CE93D8,stroke:#6A1B9A,color:#000
```

### Container Summary

| Container | Image | Technology | Port | Purpose |
|-----------|-------|-----------|------|---------|
| `ecommerce-frontend` | `sourabhs34/ecommerce-frontend:latest` | Angular 17 + Nginx | 80 | Serves UI & reverse proxies API calls |
| `ecommerce-backend` | `sourabhs34/ecommerce-backend:latest` | Spring Boot 3 + Java 21 | 8080 | REST API, business logic, authentication |
| `ecommerce-db` | `postgres:16-alpine` | PostgreSQL 16 | 5432 | Persistent data storage |

### Docker Images — Build Process

Both custom images use **multi-stage builds** for optimized image size:

```mermaid
graph LR
    subgraph "Frontend Image Build"
        F1["Stage 1: node:18-alpine<br/>npm ci → ng build --prod"] --> F2["Stage 2: nginx:alpine<br/>Copy built files + nginx.conf"]
    end

    subgraph "Backend Image Build"
        B1["Stage 1: maven:3.9.4<br/>mvn clean package"] --> B2["Stage 2: eclipse-temurin:21-jre<br/>Copy JAR → java -jar app.jar"]
    end

    style F1 fill:#E3F2FD,stroke:#1565C0,color:#000
    style F2 fill:#4FC3F7,stroke:#0277BD,color:#000
    style B1 fill:#E8F5E9,stroke:#2E7D32,color:#000
    style B2 fill:#81C784,stroke:#2E7D32,color:#000
```

---

## 2. How Frontend & Backend Communicate (Current)

The Angular app runs in the **user's browser** and makes API calls to `/api/*`. Nginx intercepts these and **reverse proxies** them to the backend container.

```mermaid
sequenceDiagram
    participant Browser as 👤 User Browser
    participant Nginx as 🌐 Nginx (Frontend)
    participant Spring as ⚙️ Spring Boot (Backend)
    participant DB as 🗄️ PostgreSQL

    Browser->>Nginx: GET /products (static page)
    Nginx-->>Browser: Serve Angular HTML/JS/CSS

    Browser->>Nginx: GET /api/products (API call)
    Nginx->>Spring: Proxy → http://backend:8080/api/products
    Spring->>DB: SELECT * FROM products
    DB-->>Spring: Result set
    Spring-->>Nginx: JSON response
    Nginx-->>Browser: JSON response

    Note over Nginx,Spring: Nginx acts as reverse proxy.<br/>Browser sees everything from same origin (port 80).<br/>No CORS issues.
```

### Key Design Decision: Nginx Reverse Proxy

```nginx
# nginx.conf (inside frontend container)
location /api/ {
    proxy_pass http://backend:8080;
}
```

- **Why?** The browser sees only one origin (`http://your-domain:80`), eliminating CORS issues.
- **How does `backend` hostname resolve?** Docker Compose creates a shared network — containers discover each other by **service name**.

---

## 3. Limitations of Current Setup

| Risk | Impact | Severity |
|------|--------|----------|
| **Single point of failure** | If the EC2 instance goes down, the entire application is unavailable | 🔴 High |
| **No horizontal scaling** | Cannot distribute load across multiple machines | 🔴 High |
| **Manual deployments** | Downtime during every redeploy | 🟡 Medium |
| **No auto-healing** | Crashed containers need manual intervention (beyond restart policy) | 🟡 Medium |
| **Resource ceiling** | Limited by the single machine's CPU/RAM | 🟡 Medium |

---

## 4. Can We Scale to Multiple Nodes WITHOUT Kubernetes?

Before jumping to Kubernetes, it's important to understand what happens if we try to run our application on **multiple machines without an orchestrator**.

### The Problem: Nodes Can't Discover Each Other

```mermaid
graph TB
    subgraph "EC2 Instance 1 (IP: 54.1.2.3)"
        FE["🌐 Frontend<br/>(Nginx)"]
    end

    subgraph "EC2 Instance 2 (IP: 54.4.5.6)"
        BE["⚙️ Backend<br/>(Spring Boot)"]
    end

    FE -.-x|"proxy_pass http://backend:8080<br/>❌ FAILS — 'backend' hostname<br/>doesn't exist outside Docker<br/>Compose network"| BE

    style FE fill:#4FC3F7,stroke:#0277BD,color:#000
    style BE fill:#81C784,stroke:#2E7D32,color:#000
```

**Why it fails:** Docker Compose creates a **local virtual network** on a single machine. The hostname `backend` is only resolvable within that network. If we move the backend to a separate EC2 instance, the frontend container has **no way to find it** by name.

### Manual Workaround (Without Kubernetes)

We would have to **hardcode IP addresses** and manually set up everything:

```mermaid
graph TB
    LB["🌐 Manual Load Balancer<br/>(Nginx / AWS ALB)<br/>Must configure manually"]

    subgraph "EC2 Instance 1 (54.1.2.3)"
        FE1["🌐 Frontend"]
    end

    subgraph "EC2 Instance 2 (54.4.5.6)"
        BE1["⚙️ Backend"]
    end

    subgraph "EC2 Instance 3 (54.7.8.9)"
        BE2["⚙️ Backend"]
    end

    subgraph "EC2 Instance 4 (54.10.11.12)"
        DB["🗄️ Database"]
    end

    USER["👤 Users"] --> LB
    LB --> FE1
    FE1 -->|"proxy_pass http://54.4.5.6:8080<br/>(hardcoded IP ❌)"| BE1
    FE1 -->|"proxy_pass http://54.7.8.9:8080<br/>(hardcoded IP ❌)"| BE2
    BE1 -->|"jdbc:postgresql://54.10.11.12:5432<br/>(hardcoded IP ❌)"| DB
    BE2 -->|"jdbc:postgresql://54.10.11.12:5432<br/>(hardcoded IP ❌)"| DB

    style LB fill:#F48FB1,stroke:#AD1457,color:#000
    style FE1 fill:#4FC3F7,stroke:#0277BD,color:#000
    style BE1 fill:#81C784,stroke:#2E7D32,color:#000
    style BE2 fill:#81C784,stroke:#2E7D32,color:#000
    style DB fill:#FFB74D,stroke:#E65100,color:#000
```

**Problems with this approach:**
- If any EC2 instance gets a **new IP** (e.g., after restart), we must **manually update** nginx.conf and redeploy
- We need to **manually configure** the load balancer to know about each backend
- If a backend instance **crashes**, nobody auto-detects or auto-restarts it
- **Adding a new backend** means updating nginx configs on every frontend manually

### What We'd Have to Do Manually (Without K8s)

| Task | Without Kubernetes | With Kubernetes |
|------|-------------------|----------------|
| **Service Discovery** | Hardcode IP addresses in nginx.conf — breaks if IP changes | Automatic DNS: `backend` resolves anywhere in cluster |
| **Load Balancing** | Set up and configure Nginx/HAProxy manually on a separate machine | Built-in: Service distributes traffic automatically |
| **Scaling** | SSH into each machine, pull image, run container manually | One command: `kubectl scale --replicas=5` |
| **Health Checks** | Write custom scripts to monitor and restart containers | Built-in: liveness/readiness probes |
| **Failover** | Manually detect failure, manually start container on another machine | Automatic: pod rescheduled on healthy node in seconds |
| **Rolling Updates** | Stop old container → deploy new → downtime during transition | Automatic: updates one pod at a time, zero downtime |
| **Config Changes** | SSH into each machine, update nginx.conf, restart | Update YAML, `kubectl apply` — rolls out everywhere |

> **Bottom Line:** Without Kubernetes, scaling to multiple nodes requires a LOT of manual infrastructure work — hardcoded IPs, custom scripts, manual monitoring. This is exactly the problem Kubernetes was built to solve.

---

## 5. Proposed Architecture (Kubernetes)

Kubernetes distributes our containers (**pods**) across **multiple nodes** (EC2 instances), providing high availability, auto-scaling, and self-healing.

```mermaid
graph TB
    LB["🌐 Load Balancer<br/>(AWS ALB / K8s Ingress)<br/>Port 80/443"]

    subgraph "Kubernetes Cluster"
        subgraph "Control Plane"
            API["API Server"]
            SCHED["Scheduler"]
            CTRL["Controller Manager"]
        end

        subgraph "Node 1 (EC2)"
            FE1["🌐 Frontend Pod<br/>(replica 1)"]
            BE1["⚙️ Backend Pod<br/>(replica 1)"]
        end

        subgraph "Node 2 (EC2)"
            FE2["🌐 Frontend Pod<br/>(replica 2)"]
            BE2["⚙️ Backend Pod<br/>(replica 2)"]
        end

        subgraph "Node 3 (EC2)"
            BE3["⚙️ Backend Pod<br/>(replica 3)"]
        end

        SVC_FE["Frontend Service<br/>(LoadBalancer)"]
        SVC_BE["Backend Service<br/>(ClusterIP)"]
    end

    subgraph "Managed Database"
        RDS["🗄️ Amazon RDS<br/>PostgreSQL"]
    end

    USER["👤 Users"] -->|HTTPS| LB
    LB --> SVC_FE
    SVC_FE --> FE1
    SVC_FE --> FE2
    FE1 --> SVC_BE
    FE2 --> SVC_BE
    SVC_BE --> BE1
    SVC_BE --> BE2
    SVC_BE --> BE3
    BE1 --> RDS
    BE2 --> RDS
    BE3 --> RDS

    style LB fill:#F48FB1,stroke:#AD1457,color:#000
    style FE1 fill:#4FC3F7,stroke:#0277BD,color:#000
    style FE2 fill:#4FC3F7,stroke:#0277BD,color:#000
    style BE1 fill:#81C784,stroke:#2E7D32,color:#000
    style BE2 fill:#81C784,stroke:#2E7D32,color:#000
    style BE3 fill:#81C784,stroke:#2E7D32,color:#000
    style RDS fill:#FFB74D,stroke:#E65100,color:#000
    style SVC_FE fill:#B39DDB,stroke:#4527A0,color:#000
    style SVC_BE fill:#B39DDB,stroke:#4527A0,color:#000
```

### What We Provide vs What Kubernetes Handles

The migration to Kubernetes **does not require any application code changes**. Our existing Docker images work as-is. We only need to provide two things:

```mermaid
graph LR
    subgraph "What WE Provide (Developer Responsibility)"
        IMG["📦 Docker Images<br/>(already built ✅)<br/>• sourabhs34/ecommerce-frontend<br/>• sourabhs34/ecommerce-backend"]
        YAML["📄 YAML Config Files<br/>(~50 lines each)<br/>• How many replicas to run<br/>• Which ports to expose<br/>• Environment variables<br/>• Health check endpoints"]
    end

    subgraph "What KUBERNETES Handles (Automated)"
        K1["🖥️ Scheduling<br/>Decides which node<br/>runs which pod"]
        K2["🌐 Networking<br/>DNS, Service discovery,<br/>load balancing"]
        K3["📈 Scaling<br/>Adds/removes pods<br/>based on traffic"]
        K4["🔄 Self-Healing<br/>Restarts crashed pods,<br/>reschedules on healthy nodes"]
        K5["🚀 Rolling Updates<br/>Zero-downtime deploys,<br/>one pod at a time"]
    end

    IMG --> K1
    YAML --> K1
    K1 --> K2
    K2 --> K3
    K3 --> K4
    K4 --> K5

    style IMG fill:#4FC3F7,stroke:#0277BD,color:#000
    style YAML fill:#FFF59D,stroke:#F9A825,color:#000
    style K1 fill:#CE93D8,stroke:#6A1B9A,color:#000
    style K2 fill:#CE93D8,stroke:#6A1B9A,color:#000
    style K3 fill:#CE93D8,stroke:#6A1B9A,color:#000
    style K4 fill:#CE93D8,stroke:#6A1B9A,color:#000
    style K5 fill:#CE93D8,stroke:#6A1B9A,color:#000
```

| Responsibility | Owner | Details |
|---------------|-------|---------|
| **Docker Images** | ✅ Already done | `sourabhs34/ecommerce-frontend:latest` and `sourabhs34/ecommerce-backend:latest` are on Docker Hub |
| **YAML Manifest Files** | Developer (one-time) | Simple configuration files that tell Kubernetes *how* to run our images (replicas, ports, env vars, secrets) |
| **Scheduling** | Kubernetes | Automatically decides which node (machine) to place each pod on, based on available resources |
| **Networking & DNS** | Kubernetes | Creates internal DNS so pods find each other by name (e.g., `backend:8080`) — same as Docker Compose |
| **Load Balancing** | Kubernetes | Distributes traffic evenly across all healthy replicas of a service |
| **Auto-Scaling** | Kubernetes | Monitors CPU/memory and adds or removes pod replicas automatically |
| **Self-Healing** | Kubernetes | Detects crashed pods and restarts them; reschedules pods if an entire node goes down |
| **Rolling Updates** | Kubernetes | Deploys new image versions one pod at a time with zero downtime |

> **Key Takeaway:** We provide the **Docker images** (the *what*) and **YAML config files** (the *how*). Kubernetes handles **everything else** — scheduling, networking, scaling, healing, and deployments — fully automated.

### Example YAML Config (Backend Deployment)

This is the only new file we need to write for the backend — Kubernetes uses it to know what to run:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
spec:
  replicas: 3                                        # Run 3 copies
  selector:
    matchLabels:
      app: ecommerce-backend
  template:
    metadata:
      labels:
        app: ecommerce-backend                       # Must match selector above
    spec:
      containers:
        - name: backend
          image: sourabhs34/ecommerce-backend:latest  # Our existing image
          ports:
            - containerPort: 8080
          env:
            - name: DB_URL
              value: jdbc:postgresql://ecommerce-db:5432/ecommerce
```

> **No application code changes.** No Dockerfile changes. Just this YAML file, and Kubernetes runs 3 copies of our backend across multiple machines, load-balanced and self-healing.

---

*Document prepared for management review.*