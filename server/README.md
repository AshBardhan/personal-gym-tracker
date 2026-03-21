# Gym Tracker - Backend

This is the Express + TypeScript backend for the Personal Gym Tracker application.

## Documentation

Please see the main [README.md](../README.md) in the root directory for complete documentation, including:

- Installation and setup instructions
- API endpoints
- Database schema
- Development guidelines

## Quick Start

```bash
# Install dependencies
npm install

# Create demo user
npm run setup

# Start development server
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- **ESM Modules** (ES2020)

## Project Structure

```text
src/
├── models/              # Mongoose models
│   ├── User.ts
│   └── Workout.ts
├── routes/              # API routes
│   ├── users.ts
│   └── workouts.ts
├── config/              # Configuration
│   └── db.ts
├── server.ts            # Server entry point
└── createDemoUser.ts    # Demo user script
```

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/gym-tracker
PORT=5000
NODE_ENV=development
```

## Module System

This project uses **ES Modules (ESM)**:

- `package.json` includes `"type": "module"`
- All imports use `.js` extensions (e.g., `./routes/users.js`)
- TypeScript compiles to ES2020 modules
- Use `node --loader ts-node/esm` for running TypeScript files

## Potential Improvements

### MUST-HAVE (Security & Stability)

#### 1. Authentication & Authorization

- Implement JWT-based authentication
- Add password hashing (bcrypt)
- Protect routes with auth middleware
- Add role-based access control (RBAC)
- Implement refresh token strategy

#### 2. Input Validation & Sanitization

- Add validation middleware (Joi, Zod, express-validator)
- Validate all incoming request data
- Sanitize inputs to prevent injection attacks
- Add proper TypeScript types for request bodies

#### 3. Error Handling

- Create centralized error handling middleware
- Add custom error classes
- Return consistent error response format
- Don't expose internal error details in production
- Log errors appropriately

#### 4. Security

- Add helmet.js for security headers
- Implement rate limiting (express-rate-limit)
- Add CSRF protection
- Sanitize MongoDB queries to prevent injection
- Add input length limits
- Implement CORS properly (not allow all origins in production)

#### 5. Environment & Configuration

- Validate environment variables on startup
- Add different configs for environments
- Use config management library
- Add `.env.example` with all required variables

### HIGH PRIORITY (API Quality)

#### 6. Logging & Monitoring

- Add structured logging (Winston, Pino)
- Log important events (auth attempts, errors, etc.)
- Add request logging middleware (morgan)
- Implement health check endpoints
- Add performance monitoring

#### 7. API Improvements

- Add API versioning (`/api/v1/...`)
- Implement pagination, sorting, filtering
- Add field selection (sparse fieldsets)
- Create API documentation (Swagger/OpenAPI)
- Add request/response compression
- Implement caching strategy (Redis)

#### 8. Database Optimization

- Add indexes on frequently queried fields (userId, date)
- Implement pagination for workout queries
- Add database connection pooling configuration
- Consider archiving old workouts
- Add data migration scripts

### MEDIUM PRIORITY (Maintainability)

#### 9. Testing

- Add unit tests for models, routes, utilities
- Add integration tests for API endpoints
- Test database operations
- Add test coverage reporting
- Mock external dependencies

#### 10. Code Organization

- Add controllers layer (separate from routes)
- Create middleware folder (auth, validation, error)
- Add utils/helpers folder
- Implement service layer for business logic
- Add constants file

#### 11. Data Management

- Add soft delete for workouts (instead of hard delete)
- Implement workout templates feature
- Add data export functionality
- Implement backup strategy

For more information, visit the [main README](../README.md).
