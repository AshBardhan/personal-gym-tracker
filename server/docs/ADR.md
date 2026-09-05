# Architecture Decision Record - Backend

This document summarizes the principal technology and design decisions for the backend application.

## Tech Stack and Rationale

- **Node.js**: Provides a non-blocking JavaScript runtime suited to an HTTP API with database-driven workloads and keeps the language consistent across the stack.
- **Express.js 4.18**: Supplies a small, flexible HTTP framework with straightforward routing and middleware composition for the current API scope.
- **TypeScript 5.9**: Adds static types to request handling, domain interfaces, and configuration, improving maintainability and compile-time safety.
- **MongoDB**: Stores workouts as documents, which naturally accommodates nested exercises and sets that are commonly read and updated together.
- **Mongoose 8.0**: Defines application schemas, validates persisted data, manages ObjectId references, and provides a typed database access layer.
- **ES Modules**: Uses the standard JavaScript module system across source and compiled output, with `@/` path aliases resolved at dev time (tsx) and build time (tsc-alias).
- **dotenv 16.3**: Loads deployment-specific database and server settings from environment variables rather than source code.
- **CORS 2.8**: Allows the browser client and API to communicate when they run on different origins during development.

## Key Design Decisions

### API Design

- **RESTful resources**: User, exercise, and workout endpoints use HTTP methods to represent create, read, update, and delete operations.
- **JSON contracts**: Requests and responses use JSON because it maps directly to the TypeScript client models and MongoDB documents.
- **Structured envelope**: All responses use `ApiResponse<T>` (`success`, `data`, `error`) via `sendSuccess` / `sendError` helpers so the client can handle outcomes uniformly.
- **User-scoped listing**: Workout list requests include a user identifier so the API returns only records belonging to that user (to be replaced by auth-scoped listing).

### Application Structure

- **Route-owned handlers**: Route modules currently contain request handling and database operations because the API has limited business logic and a small surface area.
- **Domain route separation**: User, exercise, and workout endpoints live in separate routers to preserve clear ownership as each resource evolves.
- **Central server composition**: Database startup, middleware, routers, health response, and error handling are assembled in one entry point.
- **Seed script**: `npm run seed` drops and recreates `users`, `exercises`, and `workouts` with fixtures ported from the client mocks.

### Data Modeling

- **Exercise catalog collection**: Exercises are a top-level collection with embedded variants (equipment + metrics). Custom exercises require `isCustom: true` and `userId`.
- **Embedded workout snapshots**: Workout exercises denormalize catalog fields (`exerciseId`, `variantId`, name, muscles, equipment, metrics) so sessions are self-contained at read time.
- **Set subdocuments**: Sets (`type`, `reps?`, `weight?`, `duration?`) are embedded in workout exercises, not a separate collection.
- **Referenced ownership**: Each workout stores a Mongoose ObjectId reference to its user, preserving a clear one-to-many ownership relationship.
- **Schema validation**: Mongoose enforces required fields, enum constraints, and custom validators (e.g. at least one metric per variant, custom exercise rules).
- **Indexes**: Exercises indexed by category, primary muscle group, and variant equipment; workouts indexed by `userId` and `date`.

### Database Lifecycle

- **Startup connection**: The application connects to MongoDB during server initialization so database availability is established before normal API use.
- **Fail-fast startup**: A failed database connection terminates the process rather than leaving an API running without persistence.
- **Mongoose pooling**: Connection management is delegated to Mongoose to keep database lifecycle concerns centralized.

### Middleware and Errors

- **Global parsing**: Express middleware parses JSON and URL-encoded request bodies before requests reach route handlers.
- **Development CORS**: Cross-origin requests are accepted so the independently hosted Vite client can call the API during development.
- **Route-level status codes**: Handlers distinguish validation failures, missing resources, and server failures with appropriate HTTP status codes inside the `ApiResponse` envelope.
- **Fallback error handler**: Unhandled errors pass through a final middleware that returns a generic `ApiResponse` error.

### Configuration and Identity

- **Environment configuration**: MongoDB URI and server port come from environment variables, with a default port for local development.
- **Demo user identity**: The seed script creates a stable demo user (`673092a6fd2a34e8e4b91234`) so the application can exercise user-scoped workflows before authentication is introduced.
- **Auth placeholder**: The User model includes `passwordHash` (bcrypt, not yet wired) and `isAdmin` for future role-based access.
- **Unauthenticated prototype**: The current API trusts supplied user identifiers because authentication and authorization are outside the implemented MVP scope.
