# Frontend Improvements

Planned frontend enhancements, ordered by priority. The app is **mobile-first**: every feature is designed for a phone in the gym first, then enhanced for tablets and small laptops. Task tracking lives in [MVP_ROADMAP.md](../../MVP_ROADMAP.md); catalog reference in [EXERCISES.md](../../EXERCISES.md).

## High Priority (P0)

### Layout and UI Foundation

- **Responsive container**: Cap content at 1280px (`max-w-screen-xl`) and center it on wider screens.
- **Navigation**: Bottom tab bar on phones (Home, History, Workout, Exercises); top navbar from tablet width.
- **Fixed bottom UI**: Reserve space for the tab bar and session panel; respect safe-area insets.
- **Shared components**:
  - Alert dialog for confirming actions (replaces `window.confirm`).
  - Toast with progress, success, warning, and failure variants.
  - Badge with default and active variants.
  - Text-style button for secondary actions (no border, padding, or background).
  - Action sheet for menus on phones.
- **Mobile ergonomics**: Numeric keyboards for weight, reps, and duration; touch targets of at least 44 × 44px.
- **Page states**: Consistent loading skeletons, empty states, and error states.

### Workout Domain Foundations

- **Typed contracts**: Separate read models from create/update inputs; remove legacy name-based types.
- **Services**: Typed workout and exercise services so pages never build URLs or payloads.
- **Error codes**: Surface API error codes (e.g. an active workout already exists) for flow decisions.
- **Testing setup**: Vitest and React Testing Library with fixtures shared with the server.

### Live Workout Sessions

- **Start hub**: `/workouts/new` offers Start empty workout, Resume (when a session is active), and Repeat for recent workouts.
- **Active workout page**: `/workouts/active` with elapsed time, Finish, and Cancel workout.
- **Set logging**:
  - Set type menu (warm-up, drop, failure) from the set number.
  - Previous column and input placeholders only when the exercise variant was done before.
  - Completing a set fills empty inputs from placeholders; completed sets stay editable.
  - Switching exercise or variant resets its sets (with confirmation when data exists).
  - Add set and Add exercise as text-style buttons.
- **Reorder exercises**: Up / down buttons on the active page and the workout editor; drag-and-drop later.
- **Autosave**: Debounced, ordered saves with a local draft copy and a visible save status.
- **Session panel**: Floating panel on other pages while a workout is in progress; tap to return.
- **Finish summary**: Summary page after Finish with duration, volume, and PR count.
- **Repeat workout**: Replaces workout clone; starts a new session from a past workout.
- **Exercise notes** (medium, optional): Note per exercise within a session.

## High Priority (P1)

### Personal Records

- **PR types**: Max Weight, Best Volume, and Best e1RM per exercise variant.
- **Badges**: Past PRs use the default badge; current PRs use the active badge with a crown.
- **Totals**: PR count on the finish summary, workout overview, and history cards.
- **Live feedback**: Highlight a new PR as soon as a set is completed.
- **Shared formulas**: Volume and e1RM calculated in one place and tested against the server's rules.

### Workout History and Exercise Insights

- **Charts**: Adopt a chart library (Recharts) with shared, accessible chart components.
- **History grid**: One column on phones, two from tablet width; grouped by month.
- **Workout card**:
  - Collapsed: title, date, duration, volume, sets, and PRs.
  - Expanded: each exercise with its best set by volume and a failure icon when relevant.
- **Workout overview**: Sets with e1RM and PR badges, duration, and total volume.
- **Exercise detail tabs**:
  - Overview: variants table with current PRs; stats with an Overall / variant filter.
  - History: variant filter; sessions separated by dividers instead of gray tiles.
  - Charts: e1RM, max weight, volume, and reps over time.
  - Records: current PRs, PR history, Top 10, and a rep-max table.

## Medium Priority (P2)

### Dashboard

- **Quick start**: Start workout or Resume from the home page; total workouts and streak.
- **Workout frequency**: Bar chart of workouts per week or month (toggle).
- **Muscle distribution**: Donut chart of monthly volume by primary muscle (month select).
- **Recent PRs**: Latest PRs with links to their workouts.

### Exercise Catalog

- **List**: Times performed, sort by name / frequency / last performed, equipment filter, A–Z sections.
- **Create and edit form**: Essentials first (name, category, primary muscle); secondary muscles on demand; one row per variant with equipment and a tracking preset instead of metric checkboxes.

### Workout Templates

- **Start hub sections**: My Templates and Example Templates as cards with exercise summaries.
- **Template editor**: Exercises, variants, and set types; reorder with up / down buttons.
- **Workflows**: Start a workout from a template; save a finished workout as a template; duplicate example templates.

### Pre-deploy

- **Form validation**: One typed validation contract (evaluate Zod and React Hook Form); field-level messages.
- **Error boundaries**: Fallback views for unexpected rendering failures.
- **Environment configuration**: Validate Vite env variables; disable MSW in production builds; keep `.env.example` accurate.
- **Authentication**:
  - Login and registration pages (`/login`, `/register`); session expiry and token refresh.
  - Route guards; redirect unauthenticated users; handle 401 and 403 consistently.
  - Remove reliance on `VITE_DEMO_USER_ID`.
- **Admin experience**: `/admin`, `/admin/users`, and `/admin/exercises` with role guards.
- **Integration tests**: Critical flows against MSW — start, autosave, finish, cancel, repeat, edit, delete, PR badges.

## Low Priority (P3 and Post-MVP)

### Logging Extras and Settings

- **Rest timer**: Starts when a set is completed; per-exercise default; countdown in the session panel.
- **Session summary**: Volume and change vs last session under each exercise.
- **Supersets**: Group exercises in a workout and template.
- **Settings**: Weight unit (kg / lb), default rest time, week start, theme.

### Progressive Web App

- **Installable app**: Manifest, service worker for the app shell, install prompt.
- **Offline logging**: Pair with autosave drafts for gyms with poor signal.

### Quality and Performance

- **Route loading**: Lazy-load pages with Suspense fallbacks.
- **Large datasets**: Infinite scrolling and list virtualization; monitor bundle size.
- **Accessibility**: Labelled fields and errors, keyboard support, WCAG AA contrast, screen reader checks.
- **End-to-end tests**: Playwright for core journeys and destructive actions.
- **Code quality**: Stricter TypeScript, Prettier, pre-commit checks, focused JSDoc.
- **Developer experience**: Editor settings, development guidance, MSW documentation.

### Advanced Features

- **Account recovery**: Forgot / reset password pages.
- **Data portability**: Import and export workouts (CSV / JSON).
- **Progress extras**: Calendar view, achievements, reminders.
- **AI personalization**: Suggested templates from goals and progress.
- **Social features**: Share selected workouts with privacy controls.
