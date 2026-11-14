# Backend Improvements

Planned backend enhancements, ordered by priority. Task tracking lives in [MVP_ROADMAP.md](../../MVP_ROADMAP.md); catalog reference in [EXERCISES.md](../../EXERCISES.md). Verify server-only work with curl and `mongosh` before UI integration, and ship matching MSW handlers with every contract change.

## High Priority (P0)

### Workout Domain Foundations

- **API conventions**: Add an error `code` (and optional context data) to `ApiResponse` errors; register static routes before parameter routes; cursor pagination helper.
- **Database setup**: Versioned, forward-only migrations; a guarded `npm run setup` that resets, migrates, seeds, and rebuilds records for local development only.
- **Service layer**: Workout and exercise services own persistence and cross-document rules; routes only parse, validate, and respond.
- **Testing setup**: Vitest with fixtures shared with the client.

### Live Workout Sessions

- **Lifecycle**: Workouts move from in progress to finished, with start and finish times.
- **Single session**: One in-progress workout per user, enforced by an index; conflicts return a clear error with the active workout's id.
- **Set completion**: Sets record whether they were completed; only completed sets are kept on finish.
- **Endpoints**: Start, get active, autosave update, finish, cancel, and previous sets for each exercise variant.
- **Finished-only reads**: Lists, analytics, and records ignore in-progress workouts.
- **Repeat workout**: Replaces workout clone; creates a new in-progress session from a past workout.
- **Exercise notes** (medium, optional): Note per exercise within a session.

## High Priority (P1)

### Personal Records

- **PR types**: Max Weight, Best Volume, and Best e1RM, tracked per user and exercise variant.
- **Stored outcomes**: Each set records which PRs it earned and which are still current; volume and e1RM are always calculated.
- **Recalculation**: Rebuild a variant's PRs when a finished workout is finished, edited, or deleted; a rebuild script for rule or formula changes; seed runs it.
- **Tests**: Unit tests covering the baseline, ties, set-type exclusions, and edit/delete scenarios.

### Read Endpoints for Insights

- **Pagination**: Cursor-based workout history.
- **Exercise endpoints** (when client-side calculation becomes slow): history, progress series, and records per exercise and variant.

## Medium Priority (P2)

### Workout Templates

- **Templates**: User-owned templates with ordered exercises and set types; read-only seeded example templates.
- **Workflows**: CRUD, duplicate, start a session from a template, and save a finished workout as a template.

### Exercise Catalog

- **Usage data**: Times performed and last performed per exercise; sorting by name, frequency, or last performed.
- **Tracking presets**: Validate that variant metrics match a supported tracking preset.

## Pre-deploy

### Input Validation and Sanitization

- **Request schemas**: Validate users, workouts, exercises, variants, and sets; consistent field-level errors.
- **Parameter validation**: Reject malformed ObjectIds and missing referenced resources early.
- **Input sanitization**: Trim input; reject unexpected fields and operators; limit body size.

### Environment Configuration and Health

- **Environment validation**: Verify MongoDB URI, port, and `NODE_ENV` before listening; typed config module.
- **Configuration templates**: Keep `.env.example` complete.
- **Health endpoint**: `GET /api/health` with liveness and Mongo readiness.

### Security Hardening

- **Security headers**: Helmet and a production-appropriate CSP.
- **Rate limiting**: General API limits; stricter limits on auth routes.
- **CORS policy**: Allow only approved client origins.
- **Request protection**: NoSQL injection guards; body-size and input-length limits.

### Authentication and Authorization

- **JWT authentication**: Register, login, logout, refresh, and `GET /api/auth/me`; bcrypt passwords; short-lived access tokens with rotating refresh tokens.
- **Middleware**: Attach the authenticated user; reject missing, invalid, or expired credentials consistently.
- **Ownership and roles**: Derive ownership from the authenticated user instead of `userId` in URLs or bodies; `user` and `admin` roles; admin-only catalog and user management.
- **Route shape**: Move to `GET /api/workouts`, `GET /api/workouts/active`, and `GET /api/workouts/:id`.

### Database Optimization

- **Indexes**: Compound `userId` + `date` on workouts; verify catalog indexes in `mongosh`.
- **Efficient reads**: Lean queries and projections paired with pagination.
- **Connection management**: Tune pool limits and timeouts.

## Low Priority (P3 and Post-MVP)

### Settings

- **User settings**: Weight unit, default rest time, and week start stored per user once auth exists.

### Logging and Monitoring

- **Structured logging**: Levels, timestamps, request IDs; redact secrets and personal data.
- **Request logging**: Method, path, status, duration; flag slow requests.
- **Error monitoring**: Report unexpected failures with release context.

### API Quality

- **Versioning**: Move contracts under `/api/v1` with a deprecation policy.
- **Filtering and search**: Date range, exercise, and muscle group filters.
- **Documentation**: OpenAPI specification and interactive docs.
- **Response efficiency**: Compression; caching with explicit invalidation.

### Testing

- **Integration tests**: CRUD, authorization, and validation against a controlled database.
- **Quality gates**: CI for tests and type checking; coverage targets.
- **Smoke scripts**: curl cookbooks for exercises and workouts (start, finish, repeat, templates).

### Data Management

- **Soft deletion**: Deletion timestamps excluded by default; restore where needed.
- **Data export**: JSON / CSV export with date-range selection.
- **Backups**: Encrypted off-site backups with regular restore drills.

### Advanced Features

- **Account recovery**: Expiring reset tokens, email delivery, session invalidation after password change.
- **AI plan generation**: Personalized templates from goals and progress.
- **CSRF protection**: When cookie-based sessions are used in browsers.
