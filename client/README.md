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

```
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

For more information, visit the [main README](../README.md).
