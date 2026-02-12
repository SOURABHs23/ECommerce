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
├── backend/                            # Spring Boot Application
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/                     # AppConfig, SecurityConfig
│   │   ├── controller/                 # REST API Endpoints
│   │   │   ├── AddressController       #   /api/addresses
│   │   │   ├── AuthController          #   /api/auth
│   │   │   ├── CartController          #   /api/cart
│   │   │   ├── CategoryController      #   /api/categories
│   │   │   ├── HomeController          #   /
│   │   │   ├── OrderController         #   /api/orders
│   │   │   ├── OtpController           #   /api/otp
│   │   │   └── ProductController       #   /api/products
│   │   ├── dto/
│   │   │   ├── request/                # Incoming request DTOs
│   │   │   └── response/              # Outgoing response DTOs
│   │   ├── entity/                     # JPA Entities (User, Product, Order, Cart, …)
│   │   ├── exception/                  # GlobalExceptionHandler + custom exceptions
│   │   ├── repository/                 # Spring Data JPA Repositories
│   │   ├── security/                   # JWT filter, token provider, utils
│   │   └── service/                    # Business logic layer
│   ├── .env.example                    # Template for environment variables
│   └── pom.xml
│
├── frontend/                           # Angular Application
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/                 # Auth, Admin, HomeRedirect guards
│   │   │   ├── interceptors/           # HTTP interceptors (JWT attach)
│   │   │   ├── models/                 # TypeScript interfaces / models
│   │   │   └── services/              # API services (auth, product, cart, order, …)
│   │   ├── features/
│   │   │   ├── admin/                  # Dashboard, ProductForm
│   │   │   ├── auth/                   # Login, Register
│   │   │   ├── cart/                   # Shopping cart page
│   │   │   ├── checkout/              # Checkout flow
│   │   │   ├── orders/                # Order history
│   │   │   └── products/             # Product list, Product detail
│   │   └── shared/
│   │       └── components/            # Header, Footer, ProductCard
│   └── package.json
│
└── ECommerce_API.postman_collection.json   # Postman collection for all endpoints
```

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

*   **Standalone Components** — The Angular frontend uses standalone components with lazy-loaded routes (no NgModules).
*   **DTOs** — The backend uses separate request/response DTOs to decouple API contracts from JPA entities.
*   **Global Error Handling** — `GlobalExceptionHandler` returns structured error responses for `ResourceNotFoundException`, `BadRequestException`, and validation errors.
*   **Environment Variables** — Spring Boot loads configuration from `backend/.env` via `spring.config.import`. See `.env.example` for all required keys.
