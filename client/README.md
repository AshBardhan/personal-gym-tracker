# Gym Tracker - Frontend

React + TypeScript frontend for the Personal Gym Tracker application with modern tooling and offline development support.

## Features Overview

### Core Features

- **Workout Management** — Create, view, edit, and delete workouts with catalog-backed exercises
- **Exercise Catalog** — Browse, search, filter, and create custom exercises with variants
- **Workout Detail** — Overview, editor, and analytics tabs per session
- **Exercise Detail** — Overview, editor, and cross-workout history per exercise
- **Responsive Design** — Modern UI with light/dark theme support

### User Experience

- **Catalog Picker** — Select exercises by equipment variant with metric-aware set inputs
- **Volume Calculation** — Client-side volume from weight and reps
- **Visual Feedback** — Loading states, validation, and error messages
- **Smooth Navigation** — Client-side routing with React Router nested layouts

### Developer Experience

- **API Mocking** — MSW integration for offline development
- **Structured API Client** — Axios unwraps `ApiResponse<T>` automatically
- **Type Safety** — Shared entity types across pages, services, and mocks
- **Hot Reload** — Instant feedback with Vite HMR
- **Component Library** — Reusable UI components (Button, Input, Card, MultiSelect, etc.)

## Tech Stack

| Category | Technology | Version | Purpose |
| -------- | ---------- | ------- | ------- |
| **Core** | React | 19.2 | UI library with hooks |
| **Language** | TypeScript | 5.9 | Static typing and tooling |
| **Build Tool** | Vite | 7.2 | Fast dev server and bundler |
| **Routing** | React Router DOM | 7.9 | Client-side navigation |
| **HTTP Client** | Axios | 1.13 | Promise-based API calls |
| **State** | Zustand | 5.0 | Lightweight state management |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS framework |
| **Icons** | Lucide React | 0.553 | SVG icon components |
| **Mocking** | MSW | 2.12 | Service worker for API mocking |
| **Dev Tools** | ESLint | 9.39 | Code linting |

See [Architecture Decision Records](docs/ADR.md) for technology rationale.

## Page Routes

Routes implemented in `src/App.tsx`. Workout pages use the demo user ID from config (no authentication yet).

| Route | Component | Description |
| ----- | --------- | ----------- |
| `/` | `WorkoutListPage` | Home — workout grid with volume/set metrics |
| `/workouts` | `WorkoutListPage` | Same list view as `/` |
| `/workouts/new` | `WorkoutFormPage` | Create workout |
| `/workouts/:id` | `WorkoutOverviewPage` | Workout overview (nested layout) |
| `/workouts/:id/edit` | `WorkoutEditorPage` | Edit workout |
| `/workouts/:id/analytics` | `WorkoutAnalyticsPage` | Workout analytics |
| `/exercises` | `ExerciseListPage` | Browse and search exercise catalog |
| `/exercise/new` | `ExerciseFormPage` | Create custom exercise |
| `/exercises/:id` | `ExerciseOverviewPage` | Exercise detail |
| `/exercises/:id/edit` | `ExerciseEditorPage` | Edit exercise |
| `/exercises/:id/history` | `ExerciseHistoryPage` | Exercise history across workouts |

Planned MVP routes (`/progress`, `/login`, `/admin/*`) are tracked in [MVP_ROADMAP.md](../MVP_ROADMAP.md).

## Project Structure

```text
client/
├── public/
│   └── mockServiceWorker.js        # MSW service worker
│
├── src/
│   ├── components/                  # Reusable components
│   │   ├── layout/                  # Navbar, PageContainer
│   │   ├── exercise/                # Exercise form content
│   │   ├── workout/                 # Workout form components
│   │   └── ui/                      # UI primitives
│   │
│   ├── pages/                       # Page-level components
│   │   ├── WorkoutListPage.tsx
│   │   ├── WorkoutFormPage.tsx
│   │   ├── ExerciseListPage.tsx
│   │   ├── ExerciseFormPage.tsx
│   │   ├── workout/                 # WorkoutLayout, overview, editor, analytics
│   │   └── exercise/                # ExerciseLayout, overview, editor, history
│   │
│   ├── services/                    # API layer
│   │   ├── apiClient.ts            # Axios + ApiResponse unwrap
│   │   ├── users.service.ts
│   │   ├── workouts.service.ts
│   │   └── exercises.service.ts
│   │
│   ├── stores/                      # Zustand stores
│   ├── hooks/                       # Custom React hooks
│   ├── mocks/                       # MSW setup, handlers, fixtures
│   ├── types/                       # entities.ts, api.ts
│   ├── config/                      # Environment config
│   ├── context/                     # Theme context
│   ├── utils/                       # workoutUtils, exerciseUtils
│   ├── App.tsx                      # Root component with routing
│   └── main.tsx                     # Entry point
│
├── docs/                            # Documentation
│   ├── ADR.md
│   └── IMPROVEMENTS.md
│
├── vite.config.js                   # Vite configuration (@ alias)
├── tailwind.config.js
└── package.json
```

## Mocking with MSW for Offline Development

### Overview

Mock Service Worker (MSW) intercepts HTTP requests at the network level, allowing frontend development without running the backend server.

### Configuration

**Enable/Disable MSW** — Set in `.env`:

```bash
# Use mock data (no backend needed)
VITE_ENABLE_MSW=true

# Use real API (backend must be running and seeded)
VITE_ENABLE_MSW=false
```

### Mock Data

- **Exercises:** 68 catalog exercises with variants (mirrors server seed)
- **Workouts:** 10 sample sessions
- **Demo user:** `673092a6fd2a34e8e4b91234`
- **Response format:** Same `ApiResponse<T>` envelope as the real API

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create `.env` file:

```text
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Demo user (for development)
VITE_DEMO_USER_ID=673092a6fd2a34e8e4b91234

# Enable/disable MSW
VITE_ENABLE_MSW=false
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Documentation

- [Architecture Decision Records](docs/ADR.md) — Technology choices and rationale
- [Improvements](docs/IMPROVEMENTS.md) — Planned enhancements and roadmap
- [MVP Roadmap](../MVP_ROADMAP.md) — Parallel task and route checklist
- [Exercise Catalog](../EXERCISES.md) — Categories, muscles, variants, and seed exercises
- [Main README](../README.md) — Project overview and setup
- [Server Documentation](../server/README.md) — Backend API documentation
