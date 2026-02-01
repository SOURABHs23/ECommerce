# ECommerce Spring Boot Backend

A complete Spring Boot backend application converted from Node.js/Express, featuring user authentication, JWT tokens, OTP verification, email, and SMS functionality.

## Features

- 🔐 User Authentication (Signup/Signin)
- 🎫 JWT Token-based Authorization
- 📧 Email Service Integration
- 📱 SMS/OTP Verification
- 🔒 BCrypt Password Encryption
- 🗄️ MongoDB Database
- 🛡️ Spring Security

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MongoDB
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Email**: Spring Mail (Gmail SMTP)
- **SMS**: Fast2SMS API

## Project Structure

```
backend-springboot/
├── src/main/java/com/ecommerce/
│   ├── ECommerceApplication.java          # Main application class
│   ├── config/                            # Configuration classes
│   │   ├── SecurityConfig.java            # Spring Security configuration
│   │   └── AppConfig.java                 # General app configuration
│   ├── controller/                        # REST Controllers
│   │   ├── AuthController.java            # Authentication endpoints
│   │   ├── OtpController.java             # OTP & messaging endpoints
│   │   └── HomeController.java            # Protected home endpoint
│   ├── dto/                               # Data Transfer Objects
│   │   ├── request/                       # Request DTOs
│   │   └── response/                      # Response DTOs
│   ├── entity/                            # MongoDB Entities
│   │   ├── User.java                      # User entity
│   │   └── Otp.java                       # OTP entity
│   ├── repository/                        # Spring Data Repositories
│   │   ├── UserRepository.java
│   │   └── OtpRepository.java
│   ├── service/                           # Business Logic Services
│   │   ├── AuthService.java
│   │   ├── OtpService.java
│   │   ├── EmailService.java
│   │   └── SmsService.java
│   ├── security/                          # Security Components
│   │   ├── JwtTokenProvider.java          # JWT token generation/validation
│   │   └── JwtAuthenticationFilter.java   # JWT filter for requests
│   └── exception/                         # Exception Handling
│       ├── GlobalExceptionHandler.java
│       ├── BadRequestException.java
│       └── ResourceNotFoundException.java
└── src/main/resources/
    └── application.properties             # Application configuration
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB (running locally on port 27017)
- Gmail account (for email service)
- Fast2SMS API key (for SMS service)

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.data.mongodb.uri=mongodb://localhost:27017/ecommerce

# JWT Secret (change in production!)
jwt.secret=Your-Secret-Key-Here

# Email (Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# SMS API
sms.api.key=your-fast2sms-api-key
```

## Build & Run

### Using Maven

```bash
cd backend-springboot

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Using Java

```bash
# Build
mvn clean package

# Run
java -jar target/ecommerce-backend-1.0.0.jar
```

The server will start on **http://localhost:8080**

## API Endpoints

### Authentication (Public)

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": 1234567890
}
```

#### Signin
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require Authentication)

Add JWT token to requests:
```http
Authorization: Bearer <your-jwt-token>
```

Or use cookie-based authentication (set automatically on signin).

#### Home
```http
GET /api/home
Authorization: Bearer <token>
```

#### Send Email
```http
POST /api/otp/send-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "emails": ["user@example.com"],
  "subject": "Test Subject",
  "message": "Test message"
}
```

#### Send SMS/OTP
```http
POST /api/otp/send-sms
Authorization: Bearer <token>
Content-Type: application/json

{
  "mobiles": [1234567890]
}
```
*Note: If mobiles array is empty, OTP is sent to authenticated user's mobile*

#### Verify OTP
```http
GET /api/otp/verify/{otp}
Authorization: Bearer <token>
```

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "mobile": 1234567890
  }'
```

### Signin
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Access Protected Endpoint
```bash
# Using token from signin response
curl -X GET http://localhost:8080/api/home \
  -H "Authorization: Bearer <your-token-here>"

# Or using cookies
curl -X GET http://localhost:8080/api/home \
  -b cookies.txt
```

## Key Differences from Node.js Version

### Endpoint Changes
- All endpoints now prefixed with `/api`
- Auth endpoints: `/api/auth/signup`, `/api/auth/signin`
- OTP endpoints: `/api/otp/send-email`, `/api/otp/send-sms`, `/api/otp/verify/{otp}`
- Home endpoint: `/api/home`

### Authentication
- Supports both **Bearer token** (in Authorization header) and **cookie-based** authentication
- JWT secret configurable via properties
- Automatic password hashing with BCrypt

### Response Format
All responses follow a consistent format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "firstname": String,
  "lastname": String,
  "email": String (unique),
  "password": String (hashed),
  "mobile": Number,
  "sessionToken": String,
  "verifyEmail": Boolean,
  "verifyMobile": Boolean,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### OTPs Collection
```javascript
{
  "_id": ObjectId,
  "jwt": String,
  "otp": Number,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection URI in `application.properties`

### Email Not Sending
- Enable "Less secure app access" or use App Password for Gmail
- Verify SMTP settings

### JWT Token Issues
- Check token format: `Bearer <token>`
- Ensure token hasn't expired (1 hour validity)

## Development

### Hot Reload
Spring Boot DevTools is included for automatic restart on code changes.

### Logging
Debug logging is enabled for:
- Application: `com.ecommerce`
- Spring Security: `org.springframework.security`

## Production Considerations

1. **Change JWT Secret**: Use a strong, unique secret
2. **Use Environment Variables**: Don't hardcode credentials
3. **Enable HTTPS**: Configure SSL/TLS
4. **Database Security**: Add authentication to MongoDB
5. **Rate Limiting**: Implement API rate limiting
6. **CORS Configuration**: Configure allowed origins

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
