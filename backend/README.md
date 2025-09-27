# Clean Architecture NestJS API

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL
- pnpm or npm

## 🛠️ Installation

1. Install dependencies
```bash
pnpm install
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma client
```bash
npm run prisma:generate
```

4. Run database migrations
```bash
npm run prisma:migrate
```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/docs
```

## 🏗️ Architecture

The project follows clean architecture principles with the following layers:

### API Layer (`src/api/`)
Controllers and route handlers

### Domain Layer (`src/domain/`)
Business logic and domain models

### Infrastructure Layer (`src/infra/`)
External dependencies and data access

### Core Layer (`src/core/`)
Cross-cutting concerns (config, logging, filters)

## 🔗 API Endpoints

### Users
- **POST** `/api/users` - Create a new user
- **GET** `/api/users` - Get all users with pagination
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user
- **GET** `/api/users/stats` - Get user statistics

### Health
- **GET** `/api/health` - Health check

## 📄 User Model

```typescript
{
  id: string (UUID)
  fullName: string
  email: string (unique)
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 📦 Database Management

### View database with Prisma Studio
```bash
npm run prisma:studio
```

### Create a new migration
```bash
npx prisma migrate dev --name migration_name
```

## 🎯 Example API Calls

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Doe", "email": "john@example.com"}'
```

### Get All Users
```bash
curl http://localhost:3000/api/users?skip=0&take=10
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/{id}
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/{id} \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Jane Doe"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/{id}
```
