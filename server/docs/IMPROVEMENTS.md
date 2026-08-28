# Backend Improvements

Priorities align with the near-term build order: **domain models and relationships first** (exercise catalog + workouts) so the client can integrate via API, then validation/ops hardening, then **auth for deploy**. See [MVP_ROADMAP.md](../../MVP_ROADMAP.md). Catalog reference: [EXERCISES.md](../../EXERCISES.md). Verify server-only work with curl and `mongosh` before UI integration.

## High Priority

### Models and Relationships

- **Exercise catalog model**: Persist a shared exercise list for users and admins.
  - Fields aligned with [EXERCISES.md](../../EXERCISES.md): name, category, primary muscle, secondary muscles, default variant, archived flag.
  - Stable IDs; optional `normalizedName` uniqueness.
  - Seed from the predefined list; admin CRUD; open list/read for the app (auth can lock this down later).
- **Catalog-backed workouts**: Base workout history on exercise identities and raw sets.
  - Relationships: User 1—n Workout; Workout embeds ordered exercises; each references `exerciseId` with metadata snapshots; sets embed `reps` × `weight`; optional per-log `variant` (+ custom text).
  - Distinguish the user-selected performance date from the database creation timestamp.
- **Local schema rollout**: Rebuild disposable development data against the redesigned models.
  - Make `npm run setup` seed demo user (and later admin), exercises, and sample workouts as needed.
  - Add query and uniqueness indexes for users, workouts (`userId` + date), and exercises.
- **Workout API shape for client integration**: Expose CRUD that matches client MSW contracts.
  - Prefer `GET /api/workouts` and `GET /api/workouts/:id` (migrate off `:userId` / `detail` when ready).
  - Exercise routes: list/detail (+ admin write) for catalog sync with the client.

### Input Validation and Sanitization

- **Request schemas**: Validate payloads before they reach route logic.
  - Define schemas for users, workouts, exercises, variants, and sets (auth schemas when auth lands).
  - Enforce length, range, format, and required-field rules.
  - Return consistent field-level validation errors.
- **Parameter validation**: Reject malformed route and query parameters early.
  - Validate MongoDB ObjectIds; verify referenced exercises/resources exist.
- **Input sanitization**: Normalize and trim input; reject unexpected fields/operators; limit body size.

### Error Handling

- **Central error middleware**: Route operational and unexpected failures through one response layer.
  - Standardize error codes and response shapes shared with the client.
  - Hide internal details outside development; preserve stack traces in logs.
- **Typed application errors**: Cover validation, not-found, and conflict (add auth categories when auth lands).
- **Async error propagation**: Forward rejected handler promises to the central middleware.

### Environment Configuration and Health

- **Environment validation**: Verify MongoDB URI, port, and `NODE_ENV` before listen (auth secrets when auth lands).
- **Configuration templates**: Keep `.env.example` complete; typed config module (no scattered `process.env`).
- **Health endpoints**: `GET /api/health` with liveness and Mongo readiness for deploy probes.

### Security Hardening (pre-auth baseline)

- **Security headers**: Apply Helmet and a production-appropriate CSP.
- **Rate limiting**: General API limits (stricter auth limits when login exists).
- **CORS policy**: Restrict browser access to approved client origins.
- **Request protection**: Prevent NoSQL operator injection; enforce body-size and input-length limits.

## Medium Priority

### Authentication and Authorization

Deferred until exercise/workout models and client pages integrate over the API with demo/sample identity.

- **JWT authentication**: Add secure identity verification for API requests.
  - Create registration, login, logout, and token-refresh endpoints (`/api/auth/*`).
  - Expose `GET /api/auth/me` for the current user and role.
  - Hash passwords with bcrypt.
  - Use short-lived access tokens and rotating refresh tokens.
- **Authentication middleware**: Establish user identity before protected handlers run.
  - Verify tokens and attach the authenticated user to the request.
  - Reject missing, invalid, and expired credentials consistently.
- **Resource authorization**: Ensure users can access only permitted data.
  - Protect workout routes; derive ownership from `req.user` (stop trusting body/URL `userId`).
  - Lock down user list/create/delete and exercise writes to administrators where appropriate.
  - Add `user` and `admin` roles on the User model.

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

- **Query indexes**: Compound index for user and workout date; exercise search indexes when needed.
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
