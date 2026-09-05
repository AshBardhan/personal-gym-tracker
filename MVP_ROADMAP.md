# MVP Roadmap

Checklist for a deployable Personal Gym Tracker MVP, derived from [client/docs/IMPROVEMENTS.md](client/docs/IMPROVEMENTS.md), [server/docs/IMPROVEMENTS.md](server/docs/IMPROVEMENTS.md), and product planning discussions.

## Product Overview

**Personal Gym Tracker** is a full-stack app for logging workouts and reviewing progress.

| Persona | Goal |
| ------- | ---- |
| **User** (top priority) | Log sets on a phone in the gym and analyse progress over time |
| **Admin** | Dashboard to manage users and the shared exercise catalog |

**MVP scope (build order):** (1) workout + exercise pages with real or MSW data, (2) server models/API + client integration, (3) auth with `user` / `admin` roles and ownership, then mobile polish, progress charts, admin management, and deploy (Atlas + static client + Node API).

**Explicitly post-MVP:** PWA install/offline shell, workout templates, server progress/records APIs, password-reset email flows, AI personalized plans, social features, API versioning polish.

**Development lanes:** Prefer client-only work behind MSW, server-only work verified with curl/`mongosh`, and short integration spikes for contract changes (exercise IDs, workout payloads, then auth identity and CORS).

---

## Task Checklist

Lists are ordered **highest priority first** within each category.

### Client-only (MSW; integrate later)

- [x] Workout pages: list, detail (overview/edit/analytics), create, edit aligned to catalog + variant + sets
- [x] Exercise pages: browse/search catalog; create/edit custom exercises; overview and history
- [x] Domain types + MSW handlers aligned with server exercise/workout contracts and `ApiResponse<T>`
- [x] API client unwraps `ApiResponse` envelope and normalizes error messages
- [ ] Mobile gym UX: touch targets, stacked layouts, sticky primary actions, numeric keyboards for reps/weight
- [ ] Workout logging polish: faster add exercise/set, skeletons, empty/error states, toasts for mutations
- [ ] Progress page (`/progress`): 7d / 30d / all-time volume charts from workout list data (client-calc)
- [ ] Admin shell: `/admin`, `/admin/users`, `/admin/exercises` (role guards when auth lands)
- [ ] Admin users table CRUD against MSW
- [ ] Exercise catalog admin UI (name, category, primary/secondary muscles, variants)
- [ ] Workout form validation hardening (shared schema; field-level messages)
- [ ] Env hygiene: validate Vite env; ensure MSW off in production builds; keep `.env.example` accurate
- [ ] Vitest + RTL against MSW for workout CRUD and exercise catalog flows
- [ ] Error boundaries for unexpected render failures
- [ ] Auth UI: `/login`, `/register`, logout, session expiry (MSW tokens) — **after** domain pages
- [ ] Client session layer: Axios credentials/Bearer, 401 redirect, refresh flow stubbed in MSW
- [ ] Route guards for user pages; redirect unauthenticated users to login
- [ ] Accessibility pass on workout form, exercise UI, and (later) auth/admin tables
- [ ] Lazy-load routes / Suspense fallbacks
- [ ] Search/filter workout history in the list UI
- [ ] PWA manifest + service worker shell (post-MVP stretch; can start client-only)
- [ ] Templates UI list/create/apply (post-MVP; MSW first)
- [ ] Password-reset / forgot-password pages (post-MVP)
- [ ] Playwright e2e for core journeys (post-MVP or late MVP)

### Server-only (curl + mongosh; client later)

- [x] Exercise model + relationships + seed from [EXERCISES.md](EXERCISES.md); indexes on category, muscle group, equipment
- [x] Workout schema: ordered exercises with `exerciseId` + snapshots + variant + sets
- [x] Exercise CRUD API routes (`/api/exercises`)
- [x] Workout CRUD API routes (`/api/workouts`; legacy `:userId` list + `/detail/:id` get)
- [x] Seed script: demo user, exercise catalog, sample workouts (`npm run seed`)
- [x] Structured `ApiResponse<T>` envelope on all routes (`sendSuccess` / `sendError`)
- [ ] Env validation and typed config (`MONGODB_URI`, `PORT`, `NODE_ENV`)
- [ ] Request validation (users, workouts, exercises, ObjectIds) with field-level errors
- [ ] Security baseline: Helmet, rate limits, CORS allowlist, body size limits, NoSQL injection guards
- [ ] `GET /api/health` liveness/readiness (Mongo check)
- [ ] Reshape workout routes toward `GET /api/workouts` and `GET /api/workouts/:id` (deprecate `:userId` / `detail`)
- [ ] Query indexes verified in `mongosh` (compound `userId` + `date` on workouts)
- [ ] Smoke curl script(s) covering exercises and workouts
- [ ] Auth API: register, login, logout, refresh; bcrypt — **after** domain API works with client
- [ ] `GET /api/auth/me` returning user + role
- [ ] Auth middleware attaching `req.user`; reject invalid/expired credentials
- [ ] User roles (`user` / `admin`); protect admin-only user/exercise writes
- [ ] Workout ownership: ignore client-supplied `userId`; scope list/update/delete to owner
- [ ] Structured request logging (medium)
- [ ] Progress/summary APIs (post-MVP if client-calc is enough for MVP)
- [ ] All-time records + reconciliation (post-MVP)
- [ ] Templates API + instantiate (post-MVP)
- [ ] Password-reset tokens + email (post-MVP)
- [ ] `/api/v1` versioning, OpenAPI, pagination/filtering (post-MVP)
- [ ] Integration tests for authz and validation (post-MVP / hardening)

### Must implement together

- [x] Shared `ApiResponse<T>` contract and client unwrap layer
- [x] Exercise catalog: seed ↔ MSW ↔ client picker ↔ workout submit with `exerciseId`
- [x] Workout create/update payload alignment (types, MSW, form submit)
- [ ] Auth end-to-end: real login/register against API; MSW parity for status codes and bodies
- [ ] Replace `VITE_DEMO_USER_ID` with authenticated identity on all workout calls
- [ ] CORS + credentials for staging/production client origin(s)
- [ ] Admin authorization live: UI role guards + server admin checks before any public deploy
- [ ] Staging deploy: static client + Node API + MongoDB Atlas; health check green
- [ ] Decide progress strategy for MVP (client-calc vs progress APIs) and stick to one
- [ ] Production checklist: MSW disabled, secrets set, HTTPS, rate limits on auth

---

## Routes Checklist

### Page Routes

#### Implemented

- [x] `/` — workout list (home)
- [x] `/workouts` — workout list
- [x] `/workouts/new` — create workout
- [x] `/workouts/:id` — workout overview (detail)
- [x] `/workouts/:id/edit` — edit workout
- [x] `/workouts/:id/analytics` — workout analytics
- [x] `/exercises` — exercise catalog list
- [x] `/exercise/new` — create custom exercise
- [x] `/exercises/:id` — exercise overview
- [x] `/exercises/:id/edit` — edit exercise
- [x] `/exercises/:id/history` — exercise history across workouts

#### To be implemented (MVP)

- [ ] `/login` — sign in
- [ ] `/register` — sign up
- [ ] `/progress` — user progress / analysis
- [ ] `/admin` — admin dashboard home
- [ ] `/admin/users` — manage users
- [ ] `/admin/exercises` — manage exercise catalog
- [ ] Gate existing `/`, `/workouts*`, `/exercises*` behind auth (behavior change, same paths)

#### Future (post-MVP)

- [ ] `/forgot-password` — request reset
- [ ] `/reset-password` — complete reset
- [ ] `/settings` or `/profile` — preferences / goals
- [ ] `/templates` — template list
- [ ] `/templates/new` — create template
- [ ] `/templates/:id` — view template
- [ ] `/templates/:id/edit` — edit template
- [ ] AI plan entry (dedicated route or modal flow)

### API Routes

#### Implemented

- [x] `GET /` — API status (`ApiResponse` with message)
- [x] `GET /api/users` — list users
- [x] `GET /api/users/:id` — get user
- [x] `POST /api/users` — create user
- [x] `PUT /api/users/:id` — update user
- [x] `DELETE /api/users/:id` — delete user
- [x] `GET /api/exercises` — list exercises
- [x] `GET /api/exercises/:id` — get exercise
- [x] `POST /api/exercises` — create exercise
- [x] `PUT /api/exercises/:id` — update exercise
- [x] `DELETE /api/exercises/:id` — delete exercise
- [x] `GET /api/workouts/:userId` — list workouts for user
- [x] `GET /api/workouts/detail/:id` — get workout
- [x] `POST /api/workouts` — create workout
- [x] `PUT /api/workouts/:id` — update workout
- [x] `DELETE /api/workouts/:id` — delete workout

All endpoints return `{ success, data?, error? }`.

#### To be implemented (MVP)

- [ ] `POST /api/auth/register` — register
- [ ] `POST /api/auth/login` — login
- [ ] `POST /api/auth/logout` — logout
- [ ] `POST /api/auth/refresh` — refresh tokens
- [ ] `GET /api/auth/me` — current user + role
- [ ] `GET /api/health` — liveness/readiness
- [ ] `GET /api/workouts` — list **my** workouts (auth; replace `:userId` list)
- [ ] `GET /api/workouts/:id` — get workout with ownership (replace `/detail/:id`)
- [ ] Lock down existing `/api/users*` with authz (admin vs self)
- [ ] Enforce ownership on `POST`/`PUT`/`DELETE` `/api/workouts*`
- [ ] Restrict exercise writes to admin (or owner for custom exercises) when auth lands

#### Future (post-MVP)

- [ ] `POST /api/auth/forgot-password`
- [ ] `POST /api/auth/reset-password`
- [ ] `GET|POST|PUT|DELETE /api/templates` (+ `/:id`)
- [ ] `POST /api/templates/:id/instantiate`
- [ ] `GET /api/progress/summary`
- [ ] `GET /api/progress/muscles`
- [ ] `GET /api/progress/exercises/:id`
- [ ] Records endpoints (or embedded in progress)
- [ ] Paginated/filtered `GET /api/workouts` query params
- [ ] `GET /api/export/workouts` (JSON/CSV)
- [ ] AI plan endpoint (e.g. `POST /api/ai/plans`)
- [ ] Migrate public surface to `/api/v1/...`

---

## Related docs

- [Root README](README.md)
- [Exercise Catalog](EXERCISES.md) — categories, muscles, variants, seed exercises
- [Client README](client/README.md) — page routes and frontend structure
- [Server README](server/README.md) — API routes and backend structure
- [Client improvements](client/docs/IMPROVEMENTS.md)
- [Server improvements](server/docs/IMPROVEMENTS.md)
