# E-Commerce Application

A full-stack E-Commerce application with **Angular 19** frontend and **Spring Boot 3** backend.

## 🚀 Features

*   **User Authentication**: JWT-based Signup, Signin, and Protected Routes.
*   **Product Management**: Admin interface to create, update, delete products and categories.
*   **Shopping Cart**: Add, update, remove items, and view cart totals.
*   **Checkout**: Select shipping address and place orders.
*   **Order Management**: User order history and Admin order status updates.
*   **Address Book**: Manage multiple shipping addresses.
*   **Email Notifications**: Order confirmation emails via Gmail SMTP.
*   **Responsive UI**: Modern interface with Angular 19 and CSS variables.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: Spring Boot 3.2.1
*   **Language**: Java 21
*   **Database**: PostgreSQL
*   **Security**: Spring Security + JWT
*   **Email**: Spring Boot Starter Mail

### Frontend
*   **Framework**: Angular 19
*   **Language**: TypeScript
*   **Styling**: CSS (Responsive Grid/Flexbox)

---

## 📂 Project Structure

```
ECommerce/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   │   ├── config/     # App & Security Config
│   │   ├── controller/ # API Endpoints
│   │   ├── entity/     # JPA Entities
│   │   ├── service/    # Business Logic
│   │   └── security/   # JWT Logic
│   └── .env            # Environment Variables (Required)
│
├── frontend/           # Angular Application
│   ├── src/app/
│   │   ├── core/       # Services, Guards, Interceptors
│   │   ├── features/   # Components (Auth, Product, Checkout, Admin)
│   │   └── shared/     # Reusable Components
│   └── package.json    # Frontend Dependencies
│
└── ECommerce_API.postman_collection.json # API Documentation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v18+)
*   Java JDK 21
*   PostgreSQL
*   Maven

### 2. Backend Setup
1.  Navigate to `backend` folder:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend/` directory with the following content:
    ```properties
    # Database Configuration
    DB_URL=jdbc:postgresql://localhost:5432/ecommerce
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password

    # JWT Configuration
    JWT_SECRET=YourSuperSecretKeyThereMustBeAtLeast256BitsLong
    JWT_EXPIRATION=86400000

    # Email Configuration (App Password required for Gmail)
    SPRING_MAIL_USERNAME=your_email@gmail.com
    SPRING_MAIL_PASSWORD=your_app_password
    ```
3.  Build and Run:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

### 3. Frontend Setup
1.  Navigate to `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open browser at `http://localhost:4200`.

---

## 🔑 Default Roles
*   **User**: Can browse products, manage cart, place orders.
*   **Admin**: Can manage products, categories, and view/update all orders.
    *   *Note*: To create an admin, manually update the `role` column to `ADMIN` in the `users` table for a registered user.

---

## 📝 API Documentation
A complete Postman collection is available at the root of the project:
`ECommerce_API.postman_collection.json`

Import this file into Postman to test all endpoints.

