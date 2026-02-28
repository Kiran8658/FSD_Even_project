# FEDF Backend - Spring Boot

A Spring Boot backend for the FEDF Educational Dashboard application.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA**
- **H2 Database** (in-memory, for development)
- **MySQL** (production-ready configuration included)
- **Lombok** for reducing boilerplate

## Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use the included `mvnw` wrapper)

## Quick Start

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Run the application
```bash
# Using Maven
mvn spring-boot:run

# Or using the Maven wrapper (if available)
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Start the frontend
```bash
cd ..  # Go back to project root
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Login and get JWT token |
| POST | `/api/auth/signout` | Logout (client-side token removal) |
| GET | `/api/auth/me` | Get current user info (requires auth) |

### Dashboard (Protected - Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/activities?days=7` | Get activity data for N days |
| GET | `/api/dashboard/skills` | Get user skills |
| GET | `/api/dashboard/insights` | Get user insights |
| POST | `/api/dashboard/activities/log` | Log a new activity |

### Users (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{username}` | Get user by username |
| GET | `/api/users/id/{id}` | Get user by ID |
| PUT | `/api/users/me` | Update current user profile |

## Request/Response Examples

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": "abc123",
      "username": "john_doe",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

### Sign In
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@ghostwrite.io",
    "password": "demo123"
  }'
```

### Get Dashboard Stats (with JWT)
```bash
curl http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Demo Account

A demo account is automatically created on startup:
- **Email:** `demo@ghostwrite.io`
- **Password:** `demo123`

This account comes with pre-populated:
- 30 days of activity data
- 6 skills with varying levels
- 3 insights

## Database

### Development (H2 - In Memory)
- H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:fedfdb`
- Username: `sa`
- Password: (empty)

### Production (MySQL)
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fedfdb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

## Project Structure

```
backend/
├── src/main/java/com/fedf/
│   ├── FedfBackendApplication.java     # Main application
│   ├── config/
│   │   ├── SecurityConfig.java         # Security & CORS config
│   │   └── DataInitializer.java        # Demo data seeder
│   ├── controller/
│   │   ├── AuthController.java         # Auth endpoints
│   │   ├── UserController.java         # User endpoints
│   │   └── DashboardController.java    # Dashboard endpoints
│   ├── dto/                            # Data Transfer Objects
│   ├── entity/                         # JPA Entities
│   ├── exception/
│   │   └── GlobalExceptionHandler.java # Error handling
│   ├── repository/                     # JPA Repositories
│   ├── security/
│   │   ├── JwtTokenProvider.java       # JWT generation/validation
│   │   ├── JwtAuthenticationFilter.java# JWT filter
│   │   └── CustomUserDetailsService.java
│   └── service/                        # Business logic
└── src/main/resources/
    └── application.properties          # Configuration
```

## Environment Variables

You can override configuration using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | 8080 |
| `JWT_SECRET` | JWT signing secret | (default in properties) |
| `JWT_EXPIRATION` | Token expiration (ms) | 86400000 (24h) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | localhost:5173,localhost:3000 |

## Security

- Passwords are hashed using BCrypt
- JWT tokens expire after 24 hours
- CORS is configured for frontend origins
- All dashboard endpoints require valid JWT

## Troubleshooting

### Port already in use
```bash
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### CORS errors
Ensure `cors.allowed-origins` in `application.properties` includes your frontend URL.

### JWT errors
Clear browser localStorage and sign in again.

## License

MIT
