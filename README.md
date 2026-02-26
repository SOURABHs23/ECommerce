# 🛒 ShopHub — E-Commerce Application

A full-stack E-Commerce application built with **Angular 18** and **Spring Boot 3**, featuring a modern storefront, role-based access, and a complete order lifecycle.

---

## 🚀 Features

### Storefront
*   **Home Page** — Dynamic landing page with hero banner, personalized greetings (logged-in users), category showcase, and featured products
*   **Product Browsing** — Paginated product listing with keyword search, category filtering, and price-range filtering
*   **Product Detail** — Rich product view with image gallery, quantity selector, and stock status
*   **Shopping Cart** — Add, update quantity, remove items, and real-time cart totals via Angular signals
*   **Add-to-Cart Feedback** — Premium toast notifications (Angular Material Snackbar) showing product name and a "View Cart" action button
*   **Auth-Guarded Cart** — Unauthenticated users clicking "Add to Cart" are redirected to login with a `returnUrl`, then sent back after authentication
*   **Checkout** — Select/create shipping addresses, review order summary, and place orders
*   **Order History** — View past orders and their statuses

### User Account
*   **JWT Authentication** — Secure signup, sign-in, and token-protected API routes
*   **Auto-Login on Signup** — Token returned on registration for seamless onboarding
*   **Session Token Storage** — Server-side token stored in DB for logout and single-session enforcement
*   **Cart Sync on Login** — Cart state loads immediately after login/signup so the header badge is always accurate
*   **OTP Verification** — Phone number verification via Twilio SMS with scheduled cleanup of expired OTPs
*   **Address Book** — Full CRUD for shipping addresses with default address management

### Admin Panel
*   **Dashboard** — Admin overview of the store
*   **Product Management** — Create, edit, and delete products with image uploads
*   **Category Management** — Full CRUD for product categories
*   **Order Management** — View all orders and update order statuses

### Cross-Cutting Concerns
*   **Email Notifications** — Order confirmation emails via Gmail SMTP with HTML templates (`OrderEmailComposer`)
*   **SMS Notifications** — OTP delivery via Twilio
*   **Global Exception Handling** — Structured error responses via `GlobalExceptionHandler` for `ResourceNotFoundException`, `BadRequestException`, and validation errors
*   **Input Validation** — Request DTO validation with Bean Validation annotations
*   **CORS Configuration** — Pre-configured for Angular dev server on `localhost:4200`
*   **Responsive UI** — Modern interface built with Angular Material + CSS Grid/Flexbox
*   **Angular Signals** — Reactive state management for cart, products, and UI state (no RxJS `BehaviorSubject` boilerplate)

---

## 🛠️ Technology Stack

### Backend
| Component        | Technology                        |
|------------------|-----------------------------------|
| Framework        | Spring Boot 3.2.1                 |
| Language         | Java 21                           |
| Database         | PostgreSQL                        |
| ORM              | Spring Data JPA / Hibernate       |
| Security         | Spring Security + JWT (jjwt 0.12) |
| Validation       | Spring Boot Starter Validation    |
| Email            | Spring Boot Starter Mail          |
| SMS              | Twilio SDK 9.14                   |
| Scheduling       | Spring `@Scheduled` (OTP cleanup) |
| Auditing         | JPA `@EntityListeners` + `@CreatedDate` / `@LastModifiedDate` |
| Boilerplate      | Lombok 1.18                       |
| Build Tool       | Maven                             |

### Frontend
| Component          | Technology                              |
|--------------------|-----------------------------------------|
| Framework          | Angular 18 (Standalone Components)      |
| Language           | TypeScript 5.5                          |
| UI Library         | Angular Material 18 + Angular CDK       |
| State Management   | Angular Signals (`signal`, `computed`)   |
| Notifications      | Angular Material Snackbar               |
| Styling            | SCSS + CSS Grid / Flexbox               |
| HTTP               | `HttpClient` + functional interceptors  |
| Routing            | Lazy-loaded standalone components       |
| JWT Handling       | jwt-decode                              |
| Build Tool         | Angular CLI                             |

---

## 📂 Project Structure

```
ECommerce/
├── backend/                              # Spring Boot Application
│   ├── src/main/java/com/ecommerce/
│   │   │
│   │   ├── common/                       # ── Shared Infrastructure ──
│   │   │   ├── config/                   #   SecurityConfig
│   │   │   ├── security/                 #   JwtAuthenticationFilter, JwtTokenProvider,
│   │   │   │                             #   JwtUtils, CookieService + Impl
│   │   │   ├── exception/                #   BadRequestException, ResourceNotFoundException
│   │   │   ├── handler/                  #   GlobalExceptionHandler
│   │   │   └── dto/                      #   ApiResponse
│   │   │
│   │   ├── auth/                         # ── 🔐 Auth Domain ──
│   │   │   ├── AuthController            #   /api/auth (signup, signin)
│   │   │   ├── AuthService (interface)   #   Signup, Signin contracts
│   │   │   ├── AuthServiceImpl           #   DRY token generation via generateAndSaveToken()
│   │   │   └── dto/                      #   SignInRequest, SignUpRequest, AuthResponse
│   │   │
│   │   ├── user/                         # ── 👤 User Domain ──
│   │   │   ├── User (entity)             #   JPA entity with session token
│   │   │   ├── UserRepository            #   Data access (package-private usage)
│   │   │   ├── UserService (interface)   #   Centralized user access for all domains
│   │   │   ├── UserServiceImpl           #   Implementation
│   │   │   └── HomeController            #   / (personalized greetings API)
│   │   │
│   │   ├── product/                      # ── 📦 Product Domain ──
│   │   │   ├── ProductController         #   /api/products (CRUD, search, filter, featured)
│   │   │   ├── ProductService + Impl     #   Business logic
│   │   │   ├── ImageService + Impl       #   Product image management
│   │   │   ├── Product, ProductImage     #   JPA entities
│   │   │   ├── ProductRepository         #   Data access
│   │   │   └── ProductRequest, ProductResponse
│   │   │
│   │   ├── category/                     # ── 📂 Category Domain ──
│   │   │   ├── CategoryController        #   /api/categories
│   │   │   ├── CategoryService + Impl    #   CRUD with parent-child categories
│   │   │   ├── Category                  #   JPA entity
│   │   │   ├── CategoryRepository        #   Data access
│   │   │   └── CategoryRequest, CategoryResponse
│   │   │
│   │   ├── cart/                         # ── 🛒 Cart Domain ──
│   │   │   ├── CartController            #   /api/cart (add, update, remove, clear)
│   │   │   ├── CartService + Impl        #   Cascade-based item management
│   │   │   ├── Cart, CartItem            #   JPA entities (OneToMany cascade)
│   │   │   ├── CartRepository            #   JPQL fetch join for eager loading
│   │   │   ├── CartItemRepository        #   Item-level queries
│   │   │   └── CartItemRequest, CartResponse
│   │   │
│   │   ├── order/                        # ── 📋 Order Domain ──
│   │   │   ├── OrderController           #   /api/orders (create, list, cancel, status)
│   │   │   ├── OrderService + Impl       #   Cart→Order conversion, email triggers
│   │   │   ├── Order, OrderItem, OrderStatus
│   │   │   ├── OrderRepository           #   Data access
│   │   │   └── OrderRequest, OrderResponse
│   │   │
│   │   ├── address/                      # ── 📍 Address Domain ──
│   │   │   ├── AddressController         #   /api/addresses
│   │   │   ├── AddressService + Impl     #   CRUD + default address management
│   │   │   ├── Address                   #   JPA entity
│   │   │   ├── AddressRepository         #   Data access
│   │   │   └── AddressRequest, AddressResponse
│   │   │
│   │   └── notification/                 # ── 🔔 Notification Domain ──
│   │       ├── OtpController             #   /api/otp
│   │       ├── OtpService + Impl         #   OTP generate, send, verify
│   │       ├── OtpCleanupScheduler       #   @Scheduled cleanup of expired OTPs
│   │       ├── EmailService + Impl       #   Transactional order confirmation emails
│   │       ├── SmsService + Impl         #   Twilio SMS integration
│   │       ├── OrderEmailComposer        #   HTML email template builder
│   │       ├── Otp, OtpRepository        #   JPA entity + data access
│   │       └── SendEmailRequest, SendSmsRequest
│   │
│   ├── .env.example                      # Template for environment variables
│   └── pom.xml
│
├── frontend/                             # Angular 18 Application
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/                   # authGuard, adminGuard, homeRedirectGuard
│   │   │   ├── interceptors/             # authInterceptor (JWT token attachment)
│   │   │   ├── models/                   # TypeScript interfaces (User, Product, Cart, Order, Address, Category)
│   │   │   └── services/                 # AuthService, ProductService, CartService, OrderService,
│   │   │                                 # CategoryService, AddressService (barrel-exported via index.ts)
│   │   ├── features/
│   │   │   ├── admin/                    # Dashboard, ProductForm (admin-only)
│   │   │   ├── auth/                     # Login, Register (with returnUrl support)
│   │   │   ├── cart/                     # Shopping cart page
│   │   │   ├── checkout/                 # Checkout with address selection/creation
│   │   │   ├── home/                     # Landing page with featured products & categories
│   │   │   ├── orders/                   # Order history
│   │   │   └── products/                 # ProductList (search, filter, pagination), ProductDetail
│   │   └── shared/
│   │       └── components/               # Header (nav + cart badge), Footer, ProductCard
│   │
│   ├── src/styles.scss                   # Global theme: Material palette, snackbar styles, component overrides
│   └── package.json
│
└── ECommerce_API.postman_collection.json # Postman collection for all API endpoints
```

---

## 🏗️ Architecture

### Domain-Driven Design (Microservice-Ready)

The backend is organized by **business domain** (vertical slicing), not by technical layer. Each domain package is self-contained with its own controller, service, entities, DTOs, and repositories — making it straightforward to extract into an independent microservice.

| Domain | Responsibility | API Prefix |
|---|---|---|
| `auth/` | User registration & login, JWT token generation | `/api/auth` |
| `user/` | User entity & centralized access for all domains | `/api/home` |
| `product/` | Product catalog, search, filter, featured, images | `/api/products` |
| `category/` | Product categories (parent-child hierarchy) | `/api/categories` |
| `cart/` | Shopping cart with cascade-based item management | `/api/cart` |
| `order/` | Cart→Order conversion, tracking, cancellation | `/api/orders` |
| `address/` | Shipping address book with default management | `/api/addresses` |
| `notification/` | Email (order confirmation), SMS (Twilio), OTP verification | `/api/otp` |

### SOLID Principles Applied

| Principle | Implementation |
|---|---|
| **Single Responsibility** | OTP cleanup in `OtpCleanupScheduler`; cookie logic in `CookieService`; email composition in `OrderEmailComposer`; token generation in `generateAndSaveToken()` |
| **Open/Closed** | All services are interfaces with `Impl` classes — swap implementations without modifying consumers |
| **Liskov Substitution** | `EmailService.sendOrderConfirmation` uses `OrderResponse` (typed) instead of `Object` |
| **Interface Segregation** | Email composition separated from email sending; domain-specific concerns stay in their domain |
| **Dependency Inversion** | Controllers depend on service interfaces; `UserService` abstracts all user data access across domains |

### Frontend Architecture

| Pattern | Implementation |
|---|---|
| **Standalone Components** | No `NgModules` — each component declares its own imports |
| **Lazy Loading** | All routes use `loadComponent` for code-splitting |
| **Signals** | Reactive state via `signal()` and `computed()` for cart, products, and UI state |
| **Barrel Exports** | `index.ts` files in `models/` and `services/` for clean imports |
| **Functional Guards** | `authGuard`, `adminGuard`, `homeRedirectGuard` as `CanActivateFn` |
| **Functional Interceptors** | `authInterceptor` as `HttpInterceptorFn` for JWT attachment |

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
| `USER`  | Browse products, manage cart, manage addresses, place & track orders   |
| `ADMIN` | Create/edit/delete products & categories, view & update all orders     |

> **Note:** To promote a user to admin, manually update the `role` column to `ROLE_ADMIN` in the `users` table for the desired user.

### Authentication Flow

1.  **Signup** → User created → JWT generated → token stored in DB → token returned to client → auto-login
2.  **Signin** → Credentials validated → new JWT generated → old session token replaced → token returned
3.  **Every Request** → `JwtAuthenticationFilter` extracts token from `Authorization` header → validates → sets `SecurityContext`
4.  **Logout** → Token removed from localStorage → user redirected to login

### API Access Rules

| Endpoint             | Access                       |
|----------------------|------------------------------|
| `/api/auth/**`       | Public                       |
| `GET /api/products/**` | Public                     |
| `/api/products/**`   | Admin only (CUD operations)  |
| `GET /api/categories/**` | Public                   |
| `/api/cart/**`       | Authenticated users          |
| `/api/orders/**`     | Authenticated users          |
| `/api/addresses/**`  | Authenticated users          |
| `/api/otp/**`        | Authenticated users          |

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
*   **DRY Token Generation** — `AuthServiceImpl` uses a private `generateAndSaveToken(User)` method shared by both `signup()` and `signin()`.
*   **UserService Abstraction** — `UserRepository` is only accessed within the `user/` package. All other domains use the `UserService` interface, reducing coupling.
*   **Long userId Pattern** — Service methods accept `Long userId` instead of the full `User` entity. Controllers extract the ID from `@AuthenticationPrincipal` and pass only the ID downstream.
*   **Cart Cascade Pattern** — Cart items are managed via JPA's `CascadeType.ALL` + `orphanRemoval` through `cart.addItem()`, ensuring the in-memory entity stays in sync with the DB.
*   **Standalone Components** — The Angular frontend uses standalone components with lazy-loaded routes (no NgModules).
*   **Signal-Based State** — Cart count, authentication status, and UI state are all managed via Angular signals for fine-grained reactivity.
*   **Global Error Handling** — `GlobalExceptionHandler` returns structured error responses for `ResourceNotFoundException`, `BadRequestException`, and validation errors.
*   **Environment Variables** — Spring Boot loads configuration from `backend/.env` via `spring.config.import`. See `.env.example` for all required keys.
