# Gym Tracker - Frontend

This is the React + TypeScript frontend for the Personal Gym Tracker application.

## Documentation

Please see the main [README.md](../README.md) in the root directory for complete documentation, including:

- Installation and setup instructions
- Usage guide
- API documentation
- Database schema
- Development guidelines

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Lucide React (icons)
- Zustand (state management)
- MSW (Mock Service Worker - API mocking)

## Project Structure

```text
src/
├── components/      # React components
│   ├── Navbar.tsx
│   ├── WorkoutList.tsx
│   ├── WorkoutForm.tsx
│   ├── WorkoutDetail.tsx
│   ├── Input.tsx          # Reusable input with validation
│   ├── Input.css
│   ├── Button.tsx         # Reusable button with variants
│   └── Button.css
├── stores/          # Zustand state stores
│   └── workoutFormStore.ts
├── mocks/           # MSW mock API handlers
│   ├── browser.ts         # Browser service worker
│   ├── server.ts          # Node server (for testing)
│   ├── handlers.ts        # HTTP request handlers
│   ├── data.ts            # Mock data
│   └── README.md
├── services/        # API service layer
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── setupTests.ts    # Test setup with MSW
```

## API Mocking with MSW

This project uses Mock Service Worker (MSW) to mock API calls during development and testing.

### Default Behavior

- **Development mode**: MSW is enabled by default, using mock data
- **Production mode**: MSW is disabled, uses real API

### Switching Between Mock and Real API

1. **Use Mock Data** (no backend server needed):

   ```bash
   # Set in .env file
   VITE_ENABLE_MSW=true
   ```

2. **Use Real API** (backend server must be running):

   ```bash
   # Set in .env file
   VITE_ENABLE_MSW=false
   ```

### Benefits

- ✅ Develop without running the backend server
- ✅ Consistent test data for development
- ✅ Ready for unit testing
- ✅ Faster development iteration
- ✅ Network-independent development

### Mock Data

The mock API includes:

- 3 sample workouts with various exercises
- Demo user account
- Full CRUD operations (Create, Read, Update, Delete)

See `src/mocks/README.md` for complete documentation.

## Potential Improvements

### MUST-HAVE (Security & Stability)

#### 1. Authentication & Authorization

- Implement user authentication (JWT tokens)
- Add protected routes
- Store auth tokens securely
- Add login/register pages
- Handle token refresh

#### 2. Error Handling & User Feedback

- Add error boundaries to catch React component errors
- Implement toast/notification system for success/error messages
- Add try-catch blocks in API calls with user-friendly error messages
- Handle network failures gracefully

#### 3. Environment Configuration

- Move hardcoded API URL to environment variables
- Create `.env.example` file with required variables
- Add different configs for dev/staging/production

### HIGH PRIORITY (User Experience & Quality)

#### 4. Form Validation

- Add form validation library (Zod, Yup, or React Hook Form)
- Improve inline validation with better error messages
- Add client-side validation before API calls
- Validate date ranges, numeric inputs

#### 5. Testing

- Add unit tests (Vitest/Jest + React Testing Library)
- Add integration tests for critical flows
- Test MSW handlers
- Add E2E tests (Playwright/Cypress)

### MEDIUM PRIORITY (Enhancement & Optimization)

#### 6. Performance Optimization

- Add React.memo for expensive components
- Implement lazy loading for routes (`React.lazy`)
- Add infinite scroll or pagination for workout lists
- Optimize re-renders in `WorkoutForm`
- Add debouncing for search/filter inputs

#### 7. Accessibility (a11y)

- Add ARIA labels and roles
- Ensure keyboard navigation works
- Add focus management
- Test with screen readers
- Improve color contrast

#### 8. UX Enhancements

- Add loading skeletons instead of spinners
- Implement optimistic UI updates
- Add confirmation dialogs for delete actions
- Add search/filter functionality for workouts
- Add workout statistics/charts (progress tracking)
- Export workout data (CSV/PDF)

#### 9. Code Quality

- Add PropTypes or improve TypeScript interfaces
- Extract magic numbers/strings to constants
- Add better TypeScript strict mode
- Create custom hooks for reusable logic

For more information, visit the [main README](../README.md).
