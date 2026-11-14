# MVP Roadmap

Checklist for a deployable Personal Gym Tracker MVP, derived from [client/docs/IMPROVEMENTS.md](client/docs/IMPROVEMENTS.md), [server/docs/IMPROVEMENTS.md](server/docs/IMPROVEMENTS.md), and product planning discussions.

## Product Overview

**Personal Gym Tracker** is a mobile-first, responsive full-stack app for logging workouts in the gym and reviewing progress over time.

| Persona | Goal |
| ------- | ---- |
| **User** (top priority) | Log sets quickly on a phone, track personal records, and analyse progress |
| **Admin** | Manage users and the shared exercise catalog |

**Build order:**

| Priority | Categories |
| -------- | ---------- |
| **Done** | Workout and exercise pages, catalog-backed workouts, `ApiResponse<T>` contract, MSW parity, dashboard page |
| **P0** | Layout and UI foundation · Workout domain foundations · Live workout sessions |
| **P1** | Personal records · Workout history and exercise insights |
| **P2** | Dashboard · Exercise catalog · Workout templates (medium) |
| **Pre-deploy** | Server hardening · Authentication and admin · Deploy |
| **P3 / post-MVP** | Logging extras and settings · PWA · advanced features |

**Development lanes:** client-only work behind MSW, server-only work verified with curl/`mongosh`, and short integration spikes for contract changes. Every API change ships with matching MSW handlers.

---

## Task Checklist

Ordered by priority within each category. Tags: **[C]** client, **[S]** server, **[C+S]** both.

### Done — Foundation

- [x] [C] Workout pages: list, detail (overview / edit / analytics), create, edit, clone
- [x] [C] Exercise pages: browse/search catalog; create / edit / clone custom exercises; overview and history
- [x] [C] Dashboard page with analytics and recent workouts
- [x] [C] `useApiQuery` / `useApiMutation` hooks; API client unwraps `ApiResponse<T>` and normalizes errors
- [x] [S] Exercise model with embedded variants, seeded from [EXERCISES.md](EXERCISES.md); category, muscle, and equipment indexes
- [x] [S] Workout schema: ordered exercises with `exerciseId`, `variantId`, snapshots, and sets
- [x] [S] Exercise and workout CRUD routes; workout and exercise clone routes
- [x] [S] Seed script (demo user, catalog, sample workouts) and `ApiResponse<T>` envelope on all routes
- [x] [C+S] Catalog alignment: seed ↔ MSW ↔ picker ↔ workout submit with `exerciseId`

### P0 — Layout and UI Foundation

- [ ] [C] 1280px (`max-w-screen-xl`) centered container; mobile-first breakpoints
- [ ] [C] Bottom tab bar on phones (Home, History, Workout, Exercises); top navbar from `md`
- [ ] [C] Safe-area insets and bottom padding for fixed UI (tab bar, session panel)
- [ ] [C] Alert dialog replacing `window.confirm`
- [ ] [C] Toast with progress, success, warning, and failure variants
- [ ] [C] Badge with default and active variants
- [ ] [C] Text button variant for secondary actions; action sheet for menus on phones
- [ ] [C] Numeric keyboards, 44px touch targets, consistent loading / empty / error states

### P0 — Workout Domain Foundations

- [ ] [C] Separate read and write types; typed workout and exercise services; remove legacy types
- [ ] [C+S] Error `code` in `ApiResponse` (e.g. `ACTIVE_WORKOUT_EXISTS`); MSW parity
- [ ] [S] Static routes before parameter routes; cursor pagination helper
- [ ] [S] Migration runner and guarded `npm run setup` (reset → migrate → seed → records rebuild)
- [ ] [S] Service layer for workouts and exercises; thin routes
- [ ] [C+S] Vitest in both packages with shared fixtures; `npm test` in `check:release`

### P0 — Live Workout Sessions

- [ ] [S] Workout `status`, `startedAt`, `finishedAt`; set `completed`; one in-progress workout per user
- [ ] [S] Start, active, finish, and previous-sets endpoints; lists return finished workouts only
- [ ] [C] Start hub (`/workouts/new`) with Start empty workout, Resume, and Repeat recent
- [ ] [C] Active workout page (`/workouts/active`) with Finish and Cancel
- [ ] [C] Set logging: set type menu, Previous column and placeholders (only with variant history), ✓ fills empty inputs from placeholders, completed sets stay editable
- [ ] [C] Switching exercise or variant resets its sets (confirm when data exists)
- [ ] [C] Exercise reorder with up / down buttons (active page and editor)
- [ ] [C] Autosave (debounced, serialized, client IDs, local draft) with save status
- [ ] [C] Floating session panel and session store hydrated on app load
- [ ] [C] Finish summary page (`/workouts/:id/summary`)
- [ ] [C+S] Repeat workout replaces workout clone
- [ ] [C+S] Exercise notes in a session (medium, optional)

### P1 — Personal Records

- [ ] [C+S] Canonical volume and e1RM functions (Epley/Brzycki average; e1RM only for ≤ 12 reps)
- [ ] [S] PR rules per exercise variant; `prs` / `currentPrs` set flags
- [ ] [S] Recalculation on finish, edit, and delete; `records:rebuild` script; seed rebuild
- [ ] [C+S] Unit tests with shared vectors; MSW recalculation parity
- [ ] [C] PR badges (past = default, current = active with crown) and workout PR totals
- [ ] [C+S] Provisional PR feedback when completing a set

### P1 — Workout History and Exercise Insights

- [ ] [C] Chart library (Recharts) with shared chart wrappers
- [ ] [C] History grid: 1 column on phones, 2 from `md`; month grouping
- [ ] [C] Workout card: collapsed (duration, volume, sets, PRs) and expanded (best set by volume per exercise, `F` icon for failure)
- [ ] [C] Workout overview with e1RM column, PR badges, duration, and volume
- [ ] [C] Exercise tabs: Overview (variants table, stats filter), History (variant filter, divider layout), Charts, Records
- [ ] [C] Records tab: current PRs, PR history list and timeline, Top 10, rep-max table
- [ ] [C+S] Paginated history and exercise history/progress/records endpoints (when data volume requires)

### P2 — Dashboard

- [ ] [C] Header stats and Start / Resume action
- [ ] [C] Workouts per week / month bar chart (toggle)
- [ ] [C] Monthly muscle distribution donut chart (month select)
- [ ] [C] Recent PRs list

### P2 — Exercise Catalog

- [ ] [C] Times performed and last performed per exercise
- [ ] [C] Sort by name, frequency, or last performed; equipment filter; A–Z sections
- [ ] [C] Simplified create / edit form (essentials first, tracking presets per variant)
- [ ] [S] Server-side usage and sorting (optional)

### P2 — Workout Templates (medium)

- [ ] [S] Template model and CRUD / duplicate API; read-only example templates
- [ ] [C] My Templates and Example Templates on the start hub
- [ ] [C] Template create / edit (exercises, variants, set types)
- [ ] [C+S] Start workout from template; save finished workout as template

### Pre-deploy — Server Hardening

- [ ] [S] Env validation and typed config (`MONGODB_URI`, `PORT`, `NODE_ENV`)
- [ ] [S] Request validation (users, workouts, exercises, ObjectIds) with field-level errors
- [ ] [S] Security baseline: Helmet, rate limits, CORS allowlist, body size limits, NoSQL injection guards
- [ ] [S] `GET /api/health` liveness/readiness
- [ ] [S] Compound `userId` + `date` index verified in `mongosh`; smoke curl scripts
- [ ] [C] Form validation hardening (shared schema; field-level messages)
- [ ] [C] Env hygiene: validate Vite env; MSW off in production builds
- [ ] [C] Error boundaries

### Pre-deploy — Authentication and Admin

- [ ] [S] Register, login, logout, refresh; bcrypt; `GET /api/auth/me`
- [ ] [S] Auth middleware; `user` / `admin` roles; workout ownership from `req.user`
- [ ] [C] `/login`, `/register`, session expiry, 401 redirect, route guards
- [ ] [C+S] Replace `VITE_DEMO_USER_ID` and `:userId` routes with authenticated identity
- [ ] [C] Admin shell: `/admin`, `/admin/users`, `/admin/exercises`
- [ ] [C+S] Admin authorization: UI role guards and server checks

### Pre-deploy — Deploy

- [ ] [C+S] CORS and credentials for staging/production origins
- [ ] [C+S] Staging: static client + Node API + MongoDB Atlas; health check green
- [ ] [C+S] Production checklist: MSW disabled, secrets set, HTTPS, auth rate limits

### P3 / Post-MVP

- [ ] [C] Rest timer, per-exercise session summary, supersets
- [ ] [C+S] Settings: weight unit, default rest, week start
- [ ] [C] PWA manifest and service worker; offline logging
- [ ] [C] Lazy-loaded routes; accessibility pass; Playwright e2e
- [ ] [C+S] Password reset, data export, API versioning, AI plans

---

## Routes Checklist

### Page Routes

| Route | Status | Purpose |
| ----- | ------ | ------- |
| `/` | Done (redesign P2) | Dashboard |
| `/workouts` | Done (redesign P1) | Workout history |
| `/workouts/new` | Done (becomes start hub P0) | Start empty, resume, repeat, templates |
| `/workouts/active` | P0 | Live workout logging |
| `/workouts/:id` | Done (redesign P1) | Workout overview |
| `/workouts/:id/summary` | P0 | Finish summary |
| `/workouts/:id/edit` | Done | Edit finished workout |
| `/workouts/:id/analytics` | Done (may merge into overview) | Workout analytics |
| `/exercises` | Done (polish P2) | Exercise catalog |
| `/exercises/new` | Done (polish P2) | Create custom exercise |
| `/exercises/:id` | Done (redesign P1) | Exercise overview |
| `/exercises/:id/edit` | Done (polish P2) | Edit exercise |
| `/exercises/:id/history` | Done (redesign P1) | Exercise history |
| `/exercises/:id/charts` | P1 | Exercise charts |
| `/exercises/:id/records` | P1 | Exercise records |
| `/templates/new`, `/templates/:id/edit` | P2 | Template editor |
| `/login`, `/register` | Pre-deploy | Authentication |
| `/admin`, `/admin/users`, `/admin/exercises` | Pre-deploy | Admin |
| `/settings` | P3 | Preferences |
| `/forgot-password`, `/reset-password` | Post-MVP | Account recovery |

### API Routes

| Method | Endpoint | Status |
| ------ | -------- | ------ |
| `GET` | `/` | Done |
| `GET` `POST` `PUT` `DELETE` | `/api/users`, `/api/users/:id` | Done (lock down pre-deploy) |
| `GET` `POST` `PUT` `DELETE` | `/api/exercises`, `/api/exercises/:id` | Done |
| `POST` | `/api/exercises/:id/clone` | Done |
| `GET` | `/api/workouts/:userId` | Done (finished only P0; paginated P1) |
| `GET` | `/api/workouts/detail/:id` | Done |
| `POST` | `/api/workouts` | Done (starts a session P0) |
| `PUT` `DELETE` | `/api/workouts/:id` | Done (autosave / cancel P0) |
| `POST` | `/api/workouts/:id/clone` | Done (removed P0 → `repeat`) |
| `GET` | `/api/workouts/active/:userId` | P0 |
| `POST` | `/api/workouts/:id/finish` | P0 |
| `POST` | `/api/workouts/:id/repeat` | P0 |
| `GET` | `/api/workouts/previous-sets` | P0 |
| `GET` | `/api/exercises/:id/history`, `/progress`, `/records` | P1 (optional) |
| `GET` `POST` `PUT` `DELETE` | `/api/templates`, `/api/templates/:id` | P2 |
| `POST` | `/api/templates/:id/duplicate`, `/api/templates/:id/start` | P2 |
| `POST` | `/api/workouts/:id/template` | P2 |
| `GET` | `/api/health` | Pre-deploy |
| `POST` | `/api/auth/register`, `/login`, `/logout`, `/refresh` | Pre-deploy |
| `GET` | `/api/auth/me`, `/api/workouts/active` (auth-scoped) | Pre-deploy |

All endpoints return `{ success, data?, error? }`.

---

## Related Docs

- [Root README](README.md)
- [Exercise Catalog](EXERCISES.md) — categories, muscles, variants, seed exercises
- [Client README](client/README.md) and [Client improvements](client/docs/IMPROVEMENTS.md)
- [Server README](server/README.md) and [Server improvements](server/docs/IMPROVEMENTS.md)
