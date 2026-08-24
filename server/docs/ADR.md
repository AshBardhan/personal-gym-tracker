# Architecture Decision Record - Backend

This document summarizes the principal technology and design decisions for the backend application.

## Tech Stack and Rationale

- **Node.js**: Provides a non-blocking JavaScript runtime suited to an HTTP API with database-driven workloads and keeps the language consistent across the stack.
- **Express.js 4.18**: Supplies a small, flexible HTTP framework with straightforward routing and middleware composition for the current API scope.
- **TypeScript 5.9**: Adds static types to request handling, domain interfaces, and configuration, improving maintainability and compile-time safety.
- **MongoDB**: Stores workouts as documents, which naturally accommodates nested exercises and sets that are commonly read and updated together.
- **Mongoose 8.0**: Defines application schemas, validates persisted data, manages ObjectId references, and provides a typed database access layer.
- **ES Modules**: Uses the standard JavaScript module system across source and compiled output, keeping imports aligned with the frontend toolchain.
- **dotenv 16.3**: Loads deployment-specific database and server settings from environment variables rather than source code.
- **CORS 2.8**: Allows the browser client and API to communicate when they run on different origins during development.

## Key Design Decisions

### API Design

- **RESTful resources**: User and workout endpoints use HTTP methods to represent create, read, update, and delete operations.
- **JSON contracts**: Requests and responses use JSON because it maps directly to the TypeScript client models and MongoDB documents.
- **User-scoped listing**: Workout list requests include a user identifier so the API returns only records belonging to that user.

### Application Structure

- **Route-owned handlers**: Route modules currently contain request handling and database operations because the API has limited business logic and a small surface area.
- **Domain route separation**: User and workout endpoints live in separate routers to preserve clear ownership as each resource evolves.
- **Central server composition**: Database startup, middleware, routers, health response, and error handling are assembled in one entry point.

### Data Modeling

- **Embedded workout data**: Exercises and sets are embedded in workout documents because they share the workout lifecycle and are normally retrieved together.
- **Referenced ownership**: Each workout stores a Mongoose ObjectId reference to its user, preserving a clear one-to-many ownership relationship.
- **Schema validation**: Mongoose enforces required fields and numeric constraints at persistence time to protect the stored document shape.
- **Optional classification**: Exercise category and muscle groups remain optional so workouts can be recorded without requiring taxonomy metadata.

### Database Lifecycle

- **Startup connection**: The application connects to MongoDB during server initialization so database availability is established before normal API use.
- **Fail-fast startup**: A failed database connection terminates the process rather than leaving an API running without persistence.
- **Mongoose pooling**: Connection management is delegated to Mongoose to keep database lifecycle concerns centralized.

### Middleware and Errors

- **Global parsing**: Express middleware parses JSON and URL-encoded request bodies before requests reach route handlers.
- **Development CORS**: Cross-origin requests are accepted so the independently hosted Vite client can call the API during development.
- **Route-level status codes**: Handlers distinguish validation failures, missing resources, and server failures with appropriate HTTP status codes.
- **Fallback error handler**: Unhandled errors pass through a final middleware that returns a generic server error response.

### Configuration and Identity

- **Environment configuration**: MongoDB URI and server port come from environment variables, with a default port for local development.
- **Demo user identity**: A setup script creates a stable demo user so the application can exercise user-scoped workflows before authentication is introduced.
- **Unauthenticated prototype**: The current API trusts supplied user identifiers because authentication and authorization are outside the implemented MVP scope.
