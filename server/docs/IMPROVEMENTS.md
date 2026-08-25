# Backend Improvements

## High Priority

### Workout Domain and Progress History

- **Stable workout data**: Base workout history on catalog-backed exercise identities and raw sets.
  - Add a stable exercise catalog with primary and secondary muscle groups.
  - Store ordered workout exercises with exercise metadata snapshots and raw repetitions and weight.
  - Distinguish the user-selected performance date from the database creation timestamp.
- **Workout templates**: Support reusable, user-owned exercise sequences.
  - Store ordered exercise references without completed sets or statistics.
  - Support template CRUD, independent duplication, and workout-draft instantiation with empty sets.
- **All-time exercise records**: Persist best single-set volume and estimated 1RM per user and exercise.
  - Store source workout, workout-exercise, and set identifiers for record badges.
  - Recalculate affected records transactionally after workout creation, update, or deletion.
  - Add an idempotent reconciliation command for recovery and integrity checks.
- **Progress APIs**: Provide focused responses for dashboard, workout, and exercise views.
  - Return workout and template summaries plus 7-day, 30-day, and all-time muscle-volume distributions.
  - Attribute exercise volume to its primary muscle group to avoid double counting.
  - Return exercise totals, history, and progress series filtered by volume, max weight, or estimated 1RM.
- **Local schema rollout**: Rebuild disposable development data against the redesigned models.
  - Add versioned schema migrations and make `npm run setup` clear application collections, migrate, and seed all required data from scratch.
  - Add query and uniqueness indexes for workout history, templates, and exercise records.
  - Cover metric formulas, record fallback, mutation transactions, setup idempotency, and reconciliation with regression tests.
  - Use versioned schema migrations and optional data backfills for future environments whose data must be preserved.

### Authentication and Authorization

- **JWT authentication**: Add secure identity verification for API requests.
  - Create registration, login, logout, and token-refresh endpoints.
  - Hash passwords with bcrypt.
  - Use short-lived access tokens and rotating refresh tokens.
- **Authentication middleware**: Establish user identity before protected handlers run.
  - Verify tokens and attach the authenticated user to the request.
  - Reject missing, invalid, and expired credentials consistently.
- **Resource authorization**: Ensure users can access only permitted data.
  - Protect all workout routes.
  - Enforce workout ownership on read, update, and delete operations.
  - Add user and administrator roles where elevated access is required.
- **Account recovery**: Support secure password reset workflows.
  - Issue expiring reset tokens.
  - Deliver reset links through email.
  - Invalidate existing sessions after a password change.

### Input Validation and Sanitization

- **Request schemas**: Validate payloads before they reach route logic.
  - Define schemas for users, workouts, exercises, and sets.
  - Enforce length, range, format, and required-field rules.
  - Return consistent field-level validation errors.
- **Parameter validation**: Reject malformed route and query parameters early.
  - Validate MongoDB ObjectIds.
  - Verify referenced users and resources exist.
- **Input sanitization**: Reduce injection and malformed-data risks.
  - Normalize and trim user input.
  - Reject unexpected fields and operators.
  - Limit JSON and URL-encoded request sizes.

### Error Handling

- **Central error middleware**: Route operational and unexpected failures through one response layer.
  - Standardize error codes and response shapes.
  - Hide internal details outside development.
  - Preserve stack traces in server logs.
- **Typed application errors**: Represent common failure categories explicitly.
  - Cover validation, authentication, authorization, conflict, and not-found errors.
  - Map each category to an appropriate HTTP status.
- **Async error propagation**: Remove repeated route-level error plumbing.
  - Forward rejected handler promises to the central middleware.
  - Distinguish expected operational errors from programming failures.

### Security Hardening

- **Security headers**: Apply Helmet and a production-appropriate content security policy.
  - Prevent framing and MIME-type sniffing.
  - Enforce HTTPS-related headers in production.
- **Rate limiting**: Protect public and authentication endpoints from abuse.
  - Apply general API limits per client.
  - Use stricter limits for login and password-reset attempts.
- **CORS policy**: Restrict browser access to approved origins.
  - Configure allowed methods and headers.
  - Enable credentials only when required by authentication.
- **Request protection**: Harden state-changing and database operations.
  - Add CSRF protection when using cookie-based sessions.
  - Prevent NoSQL operator injection.
  - Enforce body-size and input-length limits.

### Environment Configuration

- **Environment validation**: Verify required settings before the server starts.
  - Validate the MongoDB URI, port, runtime environment, and authentication secrets.
  - Fail with actionable messages when configuration is invalid.
- **Configuration templates**: Document every required and optional variable.
  - Add a safe `.env.example` file.
  - Separate development, test, staging, and production settings.
- **Typed configuration**: Expose parsed settings through one module.
  - Convert numeric and boolean values once.
  - Prevent direct environment access throughout application code.

## Medium Priority

### Logging and Monitoring

- **Structured logging**: Replace ad hoc console output with machine-readable logs.
  - Add levels for errors, warnings, information, and debugging.
  - Include timestamps, request identifiers, and relevant context.
  - Redact secrets and personal data.
- **Request logging**: Record API traffic for diagnosis and performance analysis.
  - Capture method, path, status, duration, and request ID.
  - Flag slow requests and database operations.
- **Health endpoints**: Expose service and dependency status.
  - Add liveness and readiness checks.
  - Verify MongoDB connectivity in readiness responses.
- **Error monitoring**: Send unexpected failures to a monitoring service.
  - Include release and environment context.
  - Configure alerts for elevated error rates.

### API Quality

- **API versioning**: Introduce a stable version prefix for public endpoints.
  - Move current contracts under `/api/v1`.
  - Define a deprecation policy for future versions.
- **Pagination and sorting**: Bound list responses and support predictable ordering.
  - Add cursor-based workout pagination.
  - Sort by workout and creation dates.
  - Return pagination metadata.
- **Filtering and search**: Support targeted workout queries.
  - Filter by date range, exercise, and muscle group.
  - Add field selection where reduced payloads are useful.
- **API documentation**: Publish an OpenAPI specification.
  - Document authentication, parameters, payloads, responses, and errors.
  - Provide an interactive documentation view.
- **Response efficiency**: Reduce repeated work and transferred data.
  - Compress suitable responses.
  - Cache frequently requested data with explicit invalidation rules.

### Database Optimization

- **Query indexes**: Index fields used by common workout queries.
  - Add a compound index for user and workout date.
  - Add exercise search indexes when search is introduced.
  - Review index usage with query plans.
- **Efficient reads**: Reduce document and Mongoose overhead for list operations.
  - Use lean queries for read-only responses.
  - Select only fields required by each endpoint.
  - Pair queries with bounded pagination.
- **Connection management**: Tune and observe the MongoDB connection pool.
  - Configure timeouts and pool limits for each environment.
  - Expose connection health through monitoring.
- **Schema evolution**: Establish repeatable database-change procedures.
  - Add versioned migration scripts with rollback guidance.
  - Backfill new fields safely.
  - Define an archival policy if historical data grows substantially.

## Low Priority

### Testing

- **Unit tests**: Cover isolated domain and validation behavior.
  - Test model constraints and utility functions.
  - Test controllers or services after responsibilities are separated.
- **Integration tests**: Verify API contracts against a controlled database.
  - Cover successful and failing CRUD operations.
  - Cover authentication, authorization, and validation boundaries.
  - Reset test data between runs.
- **Quality gates**: Make test results part of the delivery workflow.
  - Track meaningful coverage targets.
  - Run tests and type checking in continuous integration.
  - Add regression tests for resolved defects.

### Code Organization

- **Controller layer**: Separate HTTP request handling from route registration.
  - Keep routes focused on paths and middleware composition.
  - Move response orchestration into controllers.
- **Service layer**: Isolate reusable business and persistence operations.
  - Add services for workouts, authentication, and email.
  - Keep database details out of HTTP-specific code.
- **Middleware modules**: Group cross-cutting request concerns.
  - Separate authentication, validation, rate limiting, and error handling.
- **Shared utilities**: Centralize common server behavior.
  - Add helpers for async handlers, tokens, email, and constants.
  - Avoid abstractions until behavior is reused or materially complex.

### Data Management

- **Soft deletion**: Preserve recoverability for deleted workouts.
  - Record deletion timestamps.
  - Exclude deleted records by default.
  - Add restore and permanent-delete operations where appropriate.
- **Data export**: Support user-controlled data portability.
  - Export workouts as JSON and CSV.
  - Allow date-range selection.
- **Backup strategy**: Formalize backup and recovery procedures.
  - Schedule encrypted off-site backups.
  - Define retention periods.
  - Test restoration regularly.
