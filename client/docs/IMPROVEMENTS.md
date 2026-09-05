# Frontend Improvements

Priorities align with the near-term build order: **mobile polish, progress page, and validation** next, then **auth for deploy**. See [MVP_ROADMAP.md](../../MVP_ROADMAP.md). Shared catalog reference: [EXERCISES.md](../../EXERCISES.md).

## High Priority

### Mobile Gym Experience

- **Mobile layouts**: Optimize workout list, detail, and form for phone use in the gym.
  - Stack dense content appropriately on small screens.
  - Use touch targets of at least 44 × 44 pixels.
  - Adapt navigation for limited width; keep primary actions (new workout, add set) easy to reach.
- **Mobile inputs**: Use device-appropriate form controls.
  - Show numeric keyboards for repetitions and weight.
  - Use a suitable date picker for workout dates.
- **Workout logging polish**: Reduce friction while recording sets between exercises.
  - Faster add-exercise / add-set flows.
  - Clear loading, empty, and error states on list, detail, and form pages.
  - Use existing skeleton components to avoid layout shift.

### Progress Analysis (User)

- **Progress page**: Let users analyse training without waiting on dedicated progress APIs.
  - Add `/progress` with 7-day, 30-day, and all-time views.
  - Chart volume (and optionally sets) from workout list/detail data on the client for MVP.
  - Keep MSW fixtures rich enough to exercise charts offline.

### Admin Experience

- **Admin shell**: Provide a dashboard layout for elevated users (role guards can wait until auth).
  - Add `/admin`, `/admin/users`, and `/admin/exercises` routes.
- **User management UI**: List, create, update, and delete users against MSW, then the real API.
- **Exercise catalog UI**: Manage the shared exercise list (name, category, primary/secondary muscles, variants).

### Error Handling and Feedback

- **User notifications**: Provide clear feedback for successful and failed operations.
  - Add toast notifications for create, update, and delete actions.
  - Display user-friendly messages for API and network failures.
  - Provide contextual errors beside invalid form fields.
- **Application error boundaries**: Prevent rendering failures from breaking the entire interface.
  - Provide fallback views for unexpected component errors.
- **401 handling**: Redirect to login when auth lands (Axios interceptor already normalizes `ApiResponse` errors).

### Environment Configuration

- **Configuration validation**: Detect invalid or missing values during startup.
  - Keep `.env.example` accurate for API, demo-user, and MSW variables.
  - Validate required variables; disable MSW in production builds.
  - Separate development, staging, and production settings.

### Form Validation

- **Schema validation**: Define a single typed validation contract for workout and exercise forms.
  - Validate workout date, title, exercises, variant, sets, repetitions, and weight.
  - Reuse validation rules during editing and submission.
- **Detailed feedback**: Make invalid fields easy to identify and correct.
  - Show field-specific messages in real time.
  - Prevent submission until required data is valid.
- **Form tooling**: Adopt dedicated form and schema libraries where they reduce custom state logic.
  - Evaluate React Hook Form for field lifecycle management.
  - Use Zod for typed validation schemas.

### Testing (MVP-critical paths)

- **Unit coverage**: Test isolated frontend behavior with Vitest and React Testing Library.
  - Cover reusable UI components and validation states.
  - Cover custom data hooks, utilities, and Zustand form actions.
- **Integration coverage**: Test critical workflows against MSW handlers.
  - Create, edit, and delete workouts; exercise catalog flows; loading, empty, and error states.

## Medium Priority

### Authentication and Authorization

Deferred until mobile polish and progress page are in good shape.

- **Authentication flow**: Add secure account access for production use.
  - Create login and registration pages (`/login`, `/register`).
  - Support access and refresh tokens (mirror MSW until the real API is ready).
  - Log users out when sessions expire.
- **Protected navigation**: Restrict application routes according to authentication state.
  - Add route guards for workout and progress pages.
  - Redirect unauthenticated users to login.
  - Restrict admin pages to users with the `admin` role.
  - Handle unauthorized and forbidden responses consistently.
- **Secure token handling**: Integrate authentication with the API client.
  - Prefer secure HTTP-only cookies when the server contract uses them; otherwise attach Bearer tokens.
  - Attach credentials to API requests.
  - Refresh expired access tokens without interrupting active workflows.
  - Remove reliance on `VITE_DEMO_USER_ID` once auth is live.

### Workout Templates and Rich Dashboard

- **Dashboard experience**: Combine workout history, progress distribution, and templates.
  - Provide view, duplicate, and delete actions for workout and template summaries.
  - Add create-workout and create-template actions.
- **Workout and template editing**: Support ordered exercise workflows.
  - Add, replace, remove, and reorder workout exercises and their raw sets.
  - Create and edit templates containing ordered exercises without completed set data.
  - Instantiate templates into workout forms with empty sets.
- **Performance details**: Make workout records and exercise progress visible.
  - Calculate volume and estimated 1RM on the client.
  - Compare sets with server-owned all-time records and display record badges.
  - Add exercise lifetime statistics and progress graphs for volume, max weight, and e1RM.

### Account Recovery and Session Niceties

- **Password reset and remember-me**: Add forgot/reset password pages and optional persistent sessions.
- **Network resilience**: Detect offline states and add retry where operations are safe to repeat.

### Progressive Web App

- **Installable app**: Extend offline and installable behavior for gym use without a network.
  - Add an application manifest.
  - Cache the application shell with a service worker.
  - Provide an installation prompt where supported.

### User Experience

- **Optimistic actions**: Update create and delete views before the request completes; roll back on failure.
- **Safe deletion**: Confirmation dialogs (list already uses `confirm`) plus undo where practical.
- **Workout discovery**: Search by title or exercise; filter by date range and muscle group.
- **Workout editing**: Drag-and-drop reorder; keyboard shortcuts for common actions.
- **Data export**: Export workout summaries to CSV or PDF.

### Performance Optimization

- **Route loading**: Lazy-load page components with Suspense fallbacks.
- **Render efficiency**: Focused Zustand selectors; debounce search/filter input.
- **Large datasets**: Pagination or infinite scrolling; virtualize long lists; monitor bundle size.

### Accessibility

- **Semantic controls**: Associate labels and errors with form fields; meaningful names and roles.
- **Keyboard support**: Logical tab order, visible focus, dialog focus management, skip link.
- **Assistive technology**: Announce errors; meet WCAG AA contrast; test with common screen readers.

### End-to-End Testing

- **Browser journeys**: Playwright coverage for navigation, form submission, validation, and destructive actions.
- Add coverage reporting to the development workflow.

## Low Priority

### Code Quality

- **Stricter typing**: Enable stricter TypeScript options; improve component and service interfaces.
- **Shared conventions**: Extract validation limits and shared constants; reusable hooks (debounce, storage, media).
- **Component documentation**: Focused JSDoc; consider Storybook for reusable components.
- **Automated standards**: Prettier, pre-commit checks, conventional commit validation.

### Developer Experience

- **Editor setup**: Recommended VS Code extensions, workspace settings, Vite debug configs.
- **Development guidance**: Document component/state patterns, testing, and optional debug logging.
- **MSW documentation**: Restore or add `src/mocks/README.md` referenced from the client README.

### Advanced Features

- **Personalization**: Dark mode, persisted display preferences, internationalization.
- **Workout guidance**: Plans, programs, exercise descriptions, demo media, rest timers.
- **Progress tracking extras**: Calendar view, achievements, progress photos, reminders.
- **Data portability**: Import workouts from supported formats; full history export.
- **AI personalization**: Personalized workout templates from goals and ongoing progress.
- **Social features**: Share selected workout activity with privacy controls.
