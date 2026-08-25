# Frontend Improvements

## High Priority

### Workout Tracking and Progress History

- **Focused domain contracts**: Adopt stable exercise identities and purpose-specific API types.
  - Separate workout summaries, details, form inputs, templates, records, and progress responses.
  - Replace name-based exercise selection and `Partial<Workout>` mutation payloads.
  - Keep MSW fixtures and handlers synchronized with the server contracts.
- **Dashboard experience**: Combine workout history, progress distribution, and templates.
  - Provide view, duplicate, and delete actions for workout and template summaries.
  - Add create-workout and create-template actions.
  - Chart primary-muscle volume for 7 days, 30 days, or all time.
- **Workout and template editing**: Support ordered exercise workflows.
  - Add, replace, remove, and reorder workout exercises and their raw sets.
  - Create and edit templates containing ordered exercises without completed set data.
  - Instantiate templates into workout forms with empty sets that users must complete.
- **Performance details**: Make workout records and exercise progress visible.
  - Calculate loaded-workout volume and estimated 1RM metrics on the client.
  - Compare workout sets with server-owned all-time records and display exact record badges.
  - Add exercise lifetime statistics, collapsed history with expandable sets, and progress graphs for volume, max weight, and estimated 1RM.
- **Workflow coverage**: Verify calculations and cross-resource mutations.
  - Test formulas, source-ID badge matching, ordering, and empty-set template instantiation.
  - Cover workout and template CRUD, duplication, dashboard periods, and record changes after workout mutations.

### Authentication and Authorization

- **Authentication flow**: Add secure account access for production use.
  - Create login and registration pages.
  - Support access and refresh tokens.
  - Log users out when sessions expire.
  - Add password reset and remember-me workflows.
- **Protected navigation**: Restrict application routes according to authentication state.
  - Add route guards for workout pages.
  - Redirect unauthenticated users to login.
  - Handle unauthorized and forbidden responses consistently.
- **Secure token handling**: Integrate authentication with the API client.
  - Store session tokens in secure HTTP-only cookies.
  - Attach credentials to API requests.
  - Refresh expired access tokens without interrupting active workflows.

### Error Handling and Feedback

- **Application error boundaries**: Prevent rendering failures from breaking the entire interface.
  - Provide fallback views for unexpected component errors.
  - Record errors through a monitoring service.
- **User notifications**: Provide clear feedback for successful and failed operations.
  - Add toast notifications for create, update, and delete actions.
  - Display user-friendly messages for API and network failures.
  - Provide contextual errors beside invalid form fields.
- **Network resilience**: Handle temporary connectivity problems gracefully.
  - Detect offline states.
  - Add retry behavior where operations are safe to repeat.
  - Centralize API error handling in Axios interceptors.

### Environment Configuration

- **Environment templates**: Document the configuration required to run each environment.
  - Add a `.env.example` file.
  - Document API, demo-user, and MSW variables.
- **Configuration validation**: Detect invalid or missing values during startup.
  - Validate required variables.
  - Separate development, staging, and production settings.
  - Keep environment-specific feature flags in the configuration module.

### Form Validation

- **Schema validation**: Define a single typed validation contract for workout forms.
  - Validate workout date, title, exercises, sets, repetitions, and weight.
  - Reuse validation rules during editing and submission.
- **Detailed feedback**: Make invalid fields easy to identify and correct.
  - Show field-specific messages in real time.
  - Prevent submission until required data is valid.
  - Preserve entered values when validation fails.
- **Form tooling**: Adopt dedicated form and schema libraries where they reduce custom state logic.
  - Evaluate React Hook Form for field lifecycle management.
  - Use Zod for typed validation schemas.

### Testing

- **Unit coverage**: Test isolated frontend behavior with Vitest and React Testing Library.
  - Cover reusable UI components and validation states.
  - Cover custom data hooks and utility functions.
  - Cover Zustand form actions and derived validation.
- **Integration coverage**: Test critical workflows against MSW handlers.
  - Create, edit, and delete workouts.
  - Verify loading, empty, and error states.
  - Validate mock and service response contracts.
- **End-to-end coverage**: Exercise user journeys in a browser with Playwright.
  - Cover navigation and form submission.
  - Cover validation and destructive-action confirmation.
  - Add coverage reporting to the development workflow.

## Medium Priority

### Performance Optimization

- **Route loading**: Reduce the initial JavaScript workload.
  - Lazy-load page components.
  - Add Suspense fallbacks for route transitions.
- **Render efficiency**: Limit updates to components affected by state changes.
  - Use focused Zustand selectors.
  - Memoize only measured expensive components and calculations.
  - Debounce search and filter input.
- **Large datasets**: Keep workout history responsive as data grows.
  - Add pagination or infinite scrolling.
  - Consider virtualized rendering for long lists.
  - Monitor bundle size and Core Web Vitals.

### User Experience

- **Loading states**: Use existing skeleton components throughout data-driven views.
  - Cover list, detail, and form-loading states.
  - Avoid layout shifts while data is loading.
- **Optimistic actions**: Make common mutations feel immediate.
  - Update create and delete views before the request completes.
  - Restore previous state and notify the user when a request fails.
- **Safe deletion**: Prevent accidental data loss.
  - Add confirmation dialogs.
  - Offer an undo action where practical.
- **Workout discovery**: Make workout history easier to navigate.
  - Search by title or exercise.
  - Filter by date range and muscle group.
- **Data export**: Support portable workout summaries.
  - Export workout data to CSV or PDF.
- **Workout editing**: Improve repeated data-entry workflows.
  - Reorder exercises with drag and drop.
  - Add keyboard shortcuts for common actions.

### Accessibility

- **Semantic controls**: Ensure all interactive elements expose meaningful names and roles.
  - Associate labels and errors with form fields.
  - Add alternative text where visual content requires it.
- **Keyboard support**: Make every workflow usable without a pointer.
  - Maintain logical tab order and visible focus states.
  - Manage focus when dialogs open and close.
  - Add a skip link for main content.
- **Assistive technology**: Improve screen-reader feedback.
  - Announce validation and operation errors.
  - Test critical workflows with common screen readers.
  - Meet WCAG AA color-contrast requirements.

### Responsive Design

- **Mobile layouts**: Optimize workout views for small screens.
  - Stack dense content appropriately.
  - Use touch targets of at least 44 x 44 pixels.
  - Adapt navigation for limited width.
- **Mobile inputs**: Use device-appropriate form controls.
  - Show numeric keyboards for repetitions and weight.
  - Use a suitable date picker for workout dates.
- **Progressive web app**: Extend offline and installable behavior.
  - Add an application manifest.
  - Cache the application shell with a service worker.
  - Provide an installation prompt where supported.

## Low Priority

### Code Quality

- **Stricter typing**: Strengthen compile-time guarantees across the client.
  - Enable stricter TypeScript options.
  - Improve component, service, and environment interfaces.
- **Shared conventions**: Reduce duplicated values and inconsistent patterns.
  - Extract validation limits and shared constants.
  - Add reusable hooks for debounce, storage, and media queries.
- **Component documentation**: Make shared UI behavior easier to discover.
  - Add focused JSDoc where logic is not self-explanatory.
  - Consider Storybook for reusable components.
- **Automated standards**: Keep formatting and commits consistent.
  - Add Prettier and pre-commit checks.
  - Add conventional commit validation.

### Developer Experience

- **Editor setup**: Standardize the local development environment.
  - Add recommended VS Code extensions and workspace settings.
  - Add debug configurations for the Vite application.
- **Development guidance**: Document established frontend conventions.
  - Describe component and state-management patterns.
  - Document testing and debugging workflows.
  - Add optional development logging controls.

### Advanced Features

- **Personalization**: Let users tailor the application experience.
  - Add dark mode and persisted display preferences.
  - Add internationalization and locale-aware formatting.
- **Workout guidance**: Support structured and assisted training.
  - Add workout plans, programs, and exercise descriptions.
  - Add exercise demonstration media and rest timers.
- **Progress tracking**: Expand historical and motivational features.
  - Add a calendar view and achievement tracking.
  - Support progress photos and reminders.
- **Data portability**: Allow users to move data between systems.
  - Import workouts from supported formats.
  - Export complete workout history.
- **Social features**: Let users share selected workout activity while preserving privacy controls.
