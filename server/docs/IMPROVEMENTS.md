# Backend Improvements

Priorities align with the near-term build order: **validation, security, and ops hardening next**, then **auth for deploy**. See [MVP_ROADMAP.md](../../MVP_ROADMAP.md). Catalog reference: [EXERCISES.md](../../EXERCISES.md). Verify server-only work with curl and `mongosh` before UI integration.

## High Priority

### Input Validation and Sanitization

- **Request schemas**: Validate payloads before they reach route logic.
  - Define schemas for users, workouts, exercises, variants, and sets (auth schemas when auth lands).
  - Enforce length, range, format, and required-field rules.
  - Return consistent field-level validation errors inside `ApiResponse`.
- **Parameter validation**: Reject malformed route and query parameters early.
  - Validate MongoDB ObjectIds; verify referenced exercises/resources exist.
- **Input sanitization**: Normalize and trim input; reject unexpected fields/operators; limit body size.

### Environment Configuration and Health

- **Environment validation**: Verify MongoDB URI, port, and `NODE_ENV` before listen (auth secrets when auth lands).
- **Configuration templates**: Keep `.env.example` complete; typed config module (no scattered `process.env`).
- **Health endpoints**: `GET /api/health` with liveness and Mongo readiness for deploy probes.

### Security Hardening (pre-auth baseline)

- **Security headers**: Apply Helmet and a production-appropriate CSP.
- **Rate limiting**: General API limits (stricter auth limits when login exists).
- **CORS policy**: Restrict browser access to approved client origins.
- **Request protection**: Prevent NoSQL operator injection; enforce body-size and input-length limits.

### Workout API Shape (cleanup)

- **Auth-scoped listing**: Prefer `GET /api/workouts` and `GET /api/workouts/:id` (migrate off `:userId` / `detail` when auth lands).
- **Exercise write policy**: Restrict catalog mutations to admin (or owner for custom exercises) once auth is implemented.

## Medium Priority

### Authentication and Authorization

Deferred until validation and health checks are in place; domain models and client integration are done.

- **JWT authentication**: Add secure identity verification for API requests.
  - Create registration, login, logout, and token-refresh endpoints (`/api/auth/*`).
  - Expose `GET /api/auth/me` for the current user and role.
  - Hash passwords with bcrypt (`passwordHash` field exists on User model).
  - Use short-lived access tokens and rotating refresh tokens.
- **Authentication middleware**: Establish user identity before protected handlers run.
  - Verify tokens and attach the authenticated user to the request.
  - Reject missing, invalid, and expired credentials consistently.
- **Resource authorization**: Ensure users can access only permitted data.
  - Protect workout routes; derive ownership from `req.user` (stop trusting body/URL `userId`).
  - Lock down user list/create/delete and exercise writes to administrators where appropriate.
  - Enforce `user` and `admin` roles on the User model.

### Progress APIs and Records

- **Progress APIs**: Provide focused responses when client-side calculation is no longer enough.
  - Summaries and 7-day / 30-day / all-time muscle-volume distributions.
  - Attribute volume to primary muscle group to avoid double counting.
  - Exercise totals, history, and series filtered by volume, max weight, or estimated 1RM.
- **All-time exercise records**: Persist best single-set volume and estimated 1RM per user and exercise.
  - Store source workout / exercise / set identifiers for badges.
  - Recalculate transactionally after workout mutations; idempotent reconciliation command.

### Workout Templates

- **Templates**: Support reusable, user-owned exercise sequences.
  - Store ordered exercise references without completed sets.
  - Template CRUD, duplication, and workout-draft instantiation with empty sets.

### Account Recovery

- **Password reset**: Expiring reset tokens, email delivery, invalidate sessions after password change.

### Logging and Monitoring

- **Structured logging**: Levels, timestamps, request IDs; redact secrets and personal data.
- **Request logging**: Method, path, status, duration; flag slow requests.
- **Error monitoring**: Send unexpected failures to a monitoring service with release context.

### API Quality

- **API versioning**: Move contracts under `/api/v1` with a deprecation policy.
- **Pagination and sorting**: Cursor-based workout pagination; sort by workout/creation date.
- **Filtering and search**: Date range, exercise, muscle group; field selection where useful.
- **API documentation**: OpenAPI specification and interactive docs.
- **Response efficiency**: Compression; cache frequently requested data with explicit invalidation.

### Database Optimization

- **Query indexes**: Compound index for user and workout date; verify exercise indexes in `mongosh`.
- **Efficient reads**: Lean queries; select only required fields; pair with pagination.
- **Connection management**: Tune pool limits and timeouts; expose connection health.
- **Schema evolution**: Versioned migrations with rollback guidance; safe backfills; archival policy.

## Low Priority

### Testing

- **Unit tests**: Model constraints, utilities, validation; controllers/services after separation.
- **Integration tests**: CRUD, authz, and validation against a controlled database; reset between runs.
- **Quality gates**: Coverage targets; CI for tests and type checking; regression tests for fixes.
- **Smoke scripts**: Maintain curl cookbooks for exercises and workouts (add auth when implemented).

### Code Organization

- **Controller layer**: Keep routes focused on paths and middleware; move orchestration to controllers.
- **Service layer**: Workouts, exercises, authentication, email; keep persistence out of HTTP-specific code.
- **Middleware modules**: Auth, validation, rate limiting, and error handling as separate modules.
- **Shared utilities**: Async handlers, tokens, constants — only when reused or materially complex.

### Data Management

- **Soft deletion**: Deletion timestamps; exclude by default; restore / permanent-delete where needed.
- **Data export**: JSON/CSV export with date-range selection.
- **Backup strategy**: Encrypted off-site backups, retention, and regular restore drills.

### Advanced Features

- **AI plan generation**: Endpoints that produce personalized templates from goals and progress.
- **CSRF protection**: When using cookie-based sessions in browsers.
