# 🛒 ShopHub — E-Commerce Application

A full-stack E-Commerce application built with **Angular 18** and **Spring Boot 3**.

---

## 🚀 Features

### Storefront
*   **Product Browsing** — Filterable product listing with search, category filtering, and price range
*   **Product Detail** — Rich product view with multiple images and add-to-cart
*   **Shopping Cart** — Add, update quantity, remove items, and real-time cart totals
*   **Checkout** — Select a shipping address from your address book and place orders
*   **Order History** — Track past orders and their statuses

### User Account
*   **JWT Authentication** — Secure signup, sign-in, and protected routes
*   **OTP Verification** — Phone number verification via Twilio SMS
*   **Address Book** — Manage multiple shipping addresses (CRUD)

### Admin Panel
*   **Dashboard** — Overview of the store
*   **Product Management** — Create, edit, and delete products with image uploads
*   **Category Management** — Full CRUD for product categories
*   **Order Management** — View all orders and update order statuses

### Other
*   **Email Notifications** — Order confirmation emails via Gmail SMTP
*   **SMS Notifications** — OTP delivery via Twilio
*   **Global Exception Handling** — Consistent API error responses
*   **Input Validation** — Request DTO validation with Bean Validation
*   **CORS** — Pre-configured for Angular dev server on `localhost:4200`
*   **Responsive UI** — Modern interface with CSS Grid/Flexbox

---

## 🛠️ Technology Stack

### Backend
| Component        | Technology                        |
|------------------|-----------------------------------|
| Framework        | Spring Boot 3.2.1                 |
| Language         | Java 21                           |
| Database         | PostgreSQL                        |
| Security         | Spring Security + JWT (jjwt 0.12) |
| Validation       | Spring Boot Starter Validation    |
| Email            | Spring Boot Starter Mail          |
| SMS              | Twilio SDK 9.14                   |
| Boilerplate      | Lombok 1.18                       |
| Build Tool       | Maven                             |

### Frontend
| Component        | Technology                        |
|------------------|-----------------------------------|
| Framework        | Angular 18                        |
| Language         | TypeScript 5.5                    |
| UI Library       | Angular Material 18 + Angular CDK |
| Styling          | Vanilla CSS (Grid / Flexbox)      |
| JWT Handling     | jwt-decode                        |
| Build Tool       | Angular CLI                       |

---

## 📂 Project Structure

```
ECommerce/
├── backend/                              # Spring Boot Application
│   ├── src/main/java/com/ecommerce/
│   │   │
│   │   ├── common/                       # ── Shared Infrastructure ──
│   │   │   ├── config/                   #   SecurityConfig
│   │   │   ├── security/                 #   JWT filter, token provider, CookieService
│   │   │   ├── exception/                #   BadRequestException, ResourceNotFoundException
│   │   │   ├── handler/                  #   GlobalExceptionHandler
│   │   │   └── dto/                      #   ApiResponse
│   │   │
│   │   ├── auth/                         # ── 🔐 Auth Domain ──
│   │   │   ├── AuthController            #   /api/auth
│   │   │   ├── AuthService (interface)   #   Signup, Signin
│   │   │   ├── AuthServiceImpl           #   Implementation
│   │   │   ├── SignInRequest, SignUpRequest, AuthResponse
│   │   │
│   │   ├── user/                         # ── 👤 User Domain ──
│   │   │   ├── User (entity)             #   JPA entity
│   │   │   ├── UserRepository            #   Data access
│   │   │   ├── UserService (interface)   #   Centralized user access
│   │   │   ├── UserServiceImpl           #   Implementation
│   │   │   └── HomeController            #   /
│   │   │
│   │   ├── product/                      # ── 📦 Product Domain ──
│   │   │   ├── ProductController         #   /api/products
│   │   │   ├── ProductService + Impl     #   CRUD, search, filter
│   │   │   ├── ImageService + Impl       #   Product image fetching
│   │   │   ├── Product, ProductImage     #   JPA entities
│   │   │   ├── ProductRepository         #   Data access
│   │   │   └── ProductRequest, ProductResponse
│   │   │
│   │   ├── category/                     # ── 📂 Category Domain ──
│   │   │   ├── CategoryController        #   /api/categories
│   │   │   ├── CategoryService + Impl    #   CRUD
│   │   │   ├── Category                  #   JPA entity
│   │   │   ├── CategoryRepository        #   Data access
│   │   │   └── CategoryRequest, CategoryResponse
│   │   │
│   │   ├── cart/                         # ── 🛒 Cart Domain ──
│   │   │   ├── CartController            #   /api/cart
│   │   │   ├── CartService + Impl        #   Add, update, remove, clear
│   │   │   ├── Cart, CartItem            #   JPA entities
│   │   │   ├── CartRepository, CartItemRepository
│   │   │   └── CartItemRequest, CartResponse
│   │   │
│   │   ├── order/                        # ── 📋 Order Domain ──
│   │   │   ├── OrderController           #   /api/orders
│   │   │   ├── OrderService + Impl       #   Create, cancel, track
│   │   │   ├── Order, OrderItem, OrderStatus
│   │   │   ├── OrderRepository           #   Data access
│   │   │   └── OrderRequest, OrderResponse
│   │   │
│   │   ├── address/                      # ── 📍 Address Domain ──
│   │   │   ├── AddressController         #   /api/addresses
│   │   │   ├── AddressService + Impl     #   CRUD + default management
│   │   │   ├── Address                   #   JPA entity
│   │   │   ├── AddressRepository         #   Data access
│   │   │   └── AddressRequest, AddressResponse
│   │   │
│   │   └── notification/                 # ── 🔔 Notification Domain ──
│   │       ├── OtpController             #   /api/otp
│   │       ├── OtpService + Impl         #   OTP generate, send, verify
│   │       ├── OtpCleanupScheduler       #   Scheduled expired OTP cleanup
│   │       ├── EmailService + Impl       #   Transactional emails
│   │       ├── SmsService + Impl         #   Twilio SMS
│   │       ├── OrderEmailComposer        #   Order email templates
│   │       ├── Otp, OtpRepository        #   JPA entity + data access
│   │       └── SendEmailRequest, SendSmsRequest
│   │
│   ├── .env.example                      # Template for environment variables
│   └── pom.xml
│
├── frontend/                             # Angular Application
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/                   # Auth, Admin, HomeRedirect guards
│   │   │   ├── interceptors/             # HTTP interceptors (JWT attach)
│   │   │   ├── models/                   # TypeScript interfaces / models
│   │   │   └── services/                # API services (auth, product, cart, order, …)
│   │   ├── features/
│   │   │   ├── admin/                    # Dashboard, ProductForm
│   │   │   ├── auth/                     # Login, Register
│   │   │   ├── cart/                     # Shopping cart page
│   │   │   ├── checkout/                # Checkout flow
│   │   │   ├── orders/                  # Order history
│   │   │   └── products/               # Product list, Product detail
│   │   └── shared/
│   │       └── components/              # Header, Footer, ProductCard
│   └── package.json
│
└── ECommerce_API.postman_collection.json # Postman collection for all endpoints
```

---

## 🏗️ Architecture

### Domain-Driven Design (Microservice-Ready)

The backend is organized by **business domain** (vertical slicing), not by technical layer. Each domain package is self-contained with its own controller, service, entities, DTOs, and repositories — making it straightforward to extract into an independent microservice.

| Domain | Responsibility | API Prefix |
|---|---|---|
| `auth/` | User registration & login | `/api/auth` |
| `user/` | User entity & centralized access | — |
| `product/` | Product catalog, search, images | `/api/products` |
| `category/` | Product categories | `/api/categories` |
| `cart/` | Shopping cart management | `/api/cart` |
| `order/` | Order creation, tracking, cancellation | `/api/orders` |
| `address/` | Shipping address book | `/api/addresses` |
| `notification/` | Email, SMS, OTP verification | `/api/otp` |

### SOLID Principles Applied

| Principle | Implementation |
|---|---|
| **Single Responsibility** | OTP cleanup extracted to `OtpCleanupScheduler`; cookie logic to `CookieService`; email composition to `OrderEmailComposer` |
| **Open/Closed** | All services are interfaces with `Impl` classes — swap implementations without modifying consumers |
| **Liskov Substitution** | `EmailService.sendOrderConfirmation` uses `OrderResponse` (typed) instead of `Object` |
| **Interface Segregation** | Email composition separated from email sending; domain-specific concerns stay in their domain |
| **Dependency Inversion** | Controllers depend on service interfaces; `UserService` abstracts all user data access across domains |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
*   **Node.js** v18+
*   **Java** JDK 21
*   **PostgreSQL** (running instance)
*   **Maven** 3.8+

### 2. Backend Setup

1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```

2.  Copy the example env file and fill in your values:
    ```bash
    cp .env.example .env
    ```

3.  Edit `.env` with your configuration:
    ```properties
    # Database
    DB_URL=jdbc:postgresql://localhost:5432/ecommerce
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password

    # JWT
    JWT_SECRET=YourSuperSecretKeyMustBeAtLeast256BitsLong

    # Email (Gmail App Password)
    SPRING_MAIL_USERNAME=your_email@gmail.com
    SPRING_MAIL_PASSWORD=your_app_password

    # Twilio SMS (optional — required for OTP)
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=+1234567890
    ```

4.  Build and run:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    The backend will start on **`http://localhost:8080`**.

### 3. Frontend Setup

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the dev server:
    ```bash
    npm start
    ```

4.  Open your browser at **`http://localhost:4200`**.

---

## 🔐 Security & Roles

| Role    | Capabilities                                                          |
|---------|-----------------------------------------------------------------------|
| `USER`  | Browse products, manage cart, manage addresses, place orders          |
| `ADMIN` | Create/edit/delete products & categories, view & update all orders    |

> **Note:** To promote a user to admin, manually update the `role` column to `ADMIN` in the `users` table for the desired user.

### API Access Rules

| Endpoint             | Access                       |
|----------------------|------------------------------|
| `/api/auth/**`       | Public                       |
| `GET /api/products/**` | Public                     |
| `/api/products/**`   | Admin only (CUD operations)  |
| `/api/categories/**` | Public                       |
| `/api/cart/**`       | Authenticated users (USER)   |
| `/api/orders/**`     | Authenticated users (USER)   |
| `/api/addresses/**`  | Authenticated users (USER)   |

---

## 📝 API Documentation

A complete Postman collection is provided at the project root:

```
ECommerce_API.postman_collection.json
```

Import this file into [Postman](https://www.postman.com/) to explore and test all endpoints.

---

## 🧑‍💻 Development Notes

*   **Domain-Driven Structure** — Each backend domain is a self-contained module with its own controller, service interface, implementation, entities, repositories, and DTOs. This enables clean microservice extraction when needed.
*   **Service Interfaces** — All business logic is behind interfaces (`CartService`, `OrderService`, etc.) with corresponding `Impl` classes, following OCP and DIP.
*   **UserService Abstraction** — `UserRepository` is only accessed within the `user/` package. All other domains use the `UserService` interface, reducing coupling.
*   **Long userId Pattern** — Service methods accept `Long userId` instead of the full `User` entity. Controllers extract the ID from `@AuthenticationPrincipal` and pass only the ID downstream.
*   **Standalone Components** — The Angular frontend uses standalone components with lazy-loaded routes (no NgModules).
*   **Global Error Handling** — `GlobalExceptionHandler` returns structured error responses for `ResourceNotFoundException`, `BadRequestException`, and validation errors.
*   **Environment Variables** — Spring Boot loads configuration from `backend/.env` via `spring.config.import`. See `.env.example` for all required keys.
