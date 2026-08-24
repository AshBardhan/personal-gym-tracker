# Gym Tracker - Frontend

React + TypeScript frontend for the Personal Gym Tracker application with modern tooling and offline development support.

## Features Overview

### Core Features

- **Workout Management** - Create, view, edit, and delete workouts
- **Inline Editing** - Real-time form editing with visual validation feedback
- **Exercise Tracking** - Multiple exercises per workout with unlimited sets
- **Date Organization** - Calendar-based workout organization
- **Responsive Design** - Modern, mobile-friendly UI

### User Experience

- **Visual Feedback** - Red borders for invalid inputs, loading states
- **Default States** - Pre-populated forms with empty exercise/set templates
- **Instant Validation** - Field-level validation on blur and submit
- **Icon Integration** - Professional Lucide React SVG icons throughout
- **Smooth Navigation** - Client-side routing with React Router

### Developer Experience

- **API Mocking** - MSW integration for offline development
- **Type Safety** - Full TypeScript coverage
- **State Management** - Zustand for predictable state updates
- **Hot Reload** - Instant feedback with Vite HMR
- **Component Library** - Reusable UI components (Button, Input, Card, etc.)

## Tech Stack

| Category | Technology | Version | Purpose |
| -------- | ---------- | ------- | ------- |
| **Core** | React | 19.2 | UI library with hooks |
| **Language** | TypeScript | 5.9 | Static typing and tooling |
| **Build Tool** | Vite | 7.2 | Fast dev server & bundler |
| **Routing** | React Router DOM | 7.9 | Client-side navigation |
| **HTTP Client** | Axios | 1.13 | Promise-based API calls |
| **State** | Zustand | 5.0 | Lightweight state management |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS framework |
| **Icons** | Lucide React | 0.553 | SVG icon components |
| **Mocking** | MSW | 2.12 | Service worker for API mocking |
| **Dev Tools** | ESLint | 9.39 | Code linting |

See [Architecture Decision Records](docs/ADR.md) for technology rationale.

## Project Structure

```text
client/
├── public/
│   └── mockServiceWorker.js        # MSW service worker
│
├── src/
│   ├── components/                  # Reusable components
│   │   ├── layout/
│   │   │   └── Navbar.tsx          # Main navigation bar
│   │   └── ui/                     # UI primitives
│   │       ├── Button.tsx          # 6 variants (primary, secondary, etc.)
│   │       ├── Card.tsx            # Card container
│   │       ├── Input.tsx           # Self-validating input
│   │       ├── Metric.tsx          # Stat display
│   │       ├── SelectBox.tsx       # Custom select
│   │       ├── Skeleton.tsx        # Loading skeleton
│   │       └── Text.tsx            # Typography
│   │
│   ├── pages/                       # Page-level components
│   │   ├── WorkoutListPage.tsx     # Home - workout grid
│   │   ├── WorkoutDetailPage.tsx   # Single workout view
│   │   └── WorkoutFormPage.tsx     # Create/edit form
│   │
│   ├── services/                    # API layer
│   │   ├── apiClient.ts            # Configured Axios instance
│   │   ├── users.service.ts        # User API calls
│   │   └── workouts.service.ts     # Workout API calls
│   │
│   ├── stores/                      # Zustand stores
│   │   └── workoutFormStore.ts     # Form state & actions
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useWorkout.ts           # Fetch single workout
│   │   ├── useWorkouts.ts          # Fetch all workouts
│   │   └── useWorkoutMutation.ts   # Create/update/delete
│   │
│   ├── mocks/                       # MSW setup
│   │   ├── browser.ts              # Browser service worker
│   │   ├── server.ts               # Node server (for tests)
│   │   ├── handlers.ts             # Request handlers
│   │   ├── data.ts                 # Mock data
│   │   └── README.md               # MSW documentation
│   │
│   ├── types/                       # TypeScript definitions
│   │   └── workout.ts              # Workout, Exercise, Set types
│   │
│   ├── config/                      # App configuration
│   │   └── env.ts                  # Environment variables
│   │
│   ├── constants/                   # Static data
│   │   └── exercises.ts            # Exercise suggestions
│   │
│   ├── utils/                       # Utility functions
│   │   └── workoutUtils.ts         # Workout helpers
│   │
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
│
├── docs/                            # Documentation
│   ├── ADR.md                       # Architecture decisions
│   └── IMPROVEMENTS.md              # Planned enhancements
│
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── tsconfig.json                    # TypeScript config
├── eslint.config.js                 # ESLint config
└── package.json                     # Dependencies & scripts
```

## Mocking with MSW for Offline Development

### Overview

Mock Service Worker (MSW) intercepts HTTP requests at the network level, allowing frontend development without running the backend server.

### How It Works

1. **Service Worker Registration** - MSW installs a service worker in the browser
2. **Request Interception** - All API calls to `http://localhost:5000` are intercepted
3. **Mock Responses** - Handlers return mock data from in-memory storage
4. **Full CRUD** - Create, read, update, and delete operations supported
5. **Session Persistence** - Data persists during browser session, resets on refresh

### Configuration

**Enable/Disable MSW** - Set in `.env`:

```bash
# Use mock data (no backend needed)
VITE_ENABLE_MSW=true

# Use real API (backend must be running)
VITE_ENABLE_MSW=false
```

### Mock Data

- **Default workouts:** 3 sample workouts with various exercises
- **Demo user:** `673092a6fd2a34e8e4b91234`
- **Operations:** Full CRUD with in-memory storage

### Benefits

- **No Backend Dependency** - Develop UI independently
- **Consistent Data** - Same test data every time
- **Fast Iteration** - No server startup time
- **Offline Work** - No internet connection needed
- **Test Ready** - Pre-configured for unit tests

See [src/mocks/README.md](src/mocks/README.md) for complete MSW documentation.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Optional: Generate MSW service worker (already included)
npx msw init public/ --save
```

### Environment Variables

Create `.env` file:

```text
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Demo user (for development)
VITE_DEMO_USER_ID=673092a6fd2a34e8e4b91234

# Enable/disable MSW
VITE_ENABLE_MSW=true
```

### Development

```bash
# Start dev server with MSW (default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Documentation

- [Architecture Decision Records](docs/ADR.md) - Technology choices and rationale
- [Improvements](docs/IMPROVEMENTS.md) - Planned enhancements and roadmap
- [Main README](../README.md) - Project overview and setup
- [Server Documentation](../server/README.md) - Backend API documentation
