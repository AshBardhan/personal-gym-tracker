# Personal Gym Tracker

A full-stack MERN application with TypeScript support for tracking gym workouts and exercises.

## Features Overview

- **Workout Management** — Create, edit, and delete workouts with catalog-backed exercises, variants, and sets
- **Exercise Catalog** — Browse, search, and create custom exercises with muscle groups and equipment variants
- **Progress Views** — Per-workout analytics and per-exercise history across sessions
- **Structured API** — Consistent `{ success, data, error }` response envelope on all endpoints
- **Data Persistence** — MongoDB with Mongoose models and a seed script for demo data
- **API Mocking** — MSW integration for offline development (toggle via `VITE_ENABLE_MSW`)
- **Type Safety** — Full TypeScript support across the stack

## Routing

### Application Routes (Frontend)

| Route | Component | Description |
| ----- | --------- | ----------- |
| `/` | WorkoutListPage | Home — workout grid view |
| `/workouts` | WorkoutListPage | All workouts list |
| `/workouts/new` | WorkoutFormPage | Create new workout |
| `/workouts/:id` | WorkoutOverviewPage | Workout overview |
| `/workouts/:id/edit` | WorkoutEditorPage | Edit workout |
| `/workouts/:id/analytics` | WorkoutAnalyticsPage | Workout analytics |
| `/exercises` | ExerciseListPage | Exercise catalog |
| `/exercise/new` | ExerciseFormPage | Create custom exercise |
| `/exercises/:id` | ExerciseOverviewPage | Exercise detail |
| `/exercises/:id/edit` | ExerciseEditorPage | Edit exercise |
| `/exercises/:id/history` | ExerciseHistoryPage | Exercise history across workouts |

### API Routes (Backend)

All API endpoints return `ApiResponse<T>`: `{ success: boolean, data?: T, error?: { message: string } }`.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/` | API status message |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |
| `GET` | `/api/exercises` | List exercise catalog |
| `GET` | `/api/exercises/:id` | Get exercise by ID |
| `POST` | `/api/exercises` | Create exercise |
| `PUT` | `/api/exercises/:id` | Update exercise |
| `DELETE` | `/api/exercises/:id` | Delete exercise |
| `GET` | `/api/workouts/:userId` | Get all workouts for user |
| `GET` | `/api/workouts/detail/:id` | Get workout by ID |
| `POST` | `/api/workouts` | Create workout |
| `PUT` | `/api/workouts/:id` | Update workout |
| `DELETE` | `/api/workouts/:id` | Delete workout |

## Tech Stack

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB ODM
- **TypeScript** — Static typing

### Frontend

- **React 19** — UI library
- **TypeScript** — Static typing
- **Vite** — Build tool and dev server
- **React Router** — Client-side routing
- **Axios** — HTTP client with `ApiResponse` unwrap
- **Zustand** — State management
- **Tailwind CSS** — Utility-first CSS
- **MSW** — API mocking for development

## Project Structure

```text
personal-gym-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components (workout + exercise)
│   │   ├── services/       # API services
│   │   ├── stores/         # State management
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types (entities, api)
│   │   ├── mocks/          # MSW handlers and fixtures
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   ├── docs/               # Frontend documentation
│   └── package.json
└── server/                 # Express backend
    ├── src/
    │   ├── models/         # Mongoose models (User, Exercise, Workout, Set)
    │   ├── routes/         # API routes
    │   ├── seed/           # Seed data and script
    │   ├── types/          # Shared types (api, exercise)
    │   ├── utils/          # Helpers (api envelope, volume)
    │   ├── config/         # Configuration
    │   └── server.ts       # Entry point
    ├── docs/               # Backend documentation
    └── package.json
```

## Installation

### Prerequisites

- Node.js 22+ and npm 9+
- MongoDB (local or Atlas)

### Quick Start

```bash
# Install root tooling and application dependencies.
npm install
npm install --prefix client
npm install --prefix server

# Configure server/.env for MongoDB and client/.env for the API and MSW.

# Start local MongoDB and seed demo data.
sudo systemctl start mongod
npm run seed --prefix server

# Start both applications or either application independently.
npm run dev
npm run dev:client
npm run dev:server

# Build both applications or either application independently.
npm run build
npm run build:client
npm run build:server

# Check code quality and release readiness.
npm run lint
npm run check:release

# Bump changed components, then create the application release (patch by default).
npm run version:client
npm run version:server --minor
npm run release -m "release summary" --minor
```

### Access the apps

- React Client: `http://localhost:5173`
- Node.js Server: `http://localhost:5000`

Set `VITE_ENABLE_MSW=false` in `client/.env` to use the real API after seeding.

## Documentation

- [MVP Roadmap](MVP_ROADMAP.md) — Product overview, task checklist, and routes checklist

### Frontend Documentation

- [Client README](client/README.md) — Frontend overview, page routes, and structure
- [Frontend ADR](client/docs/ADR.md) — Architecture decisions and rationale
- [Frontend Improvements](client/docs/IMPROVEMENTS.md) — Planned enhancements

### Backend Documentation

- [Server README](server/README.md) — Backend overview, API routes, and structure
- [Backend ADR](server/docs/ADR.md) — Architecture decisions and rationale
- [Database Setup](server/docs/DATABASE_SETUP.md) — MongoDB setup and schema
- [Exercise Catalog](EXERCISES.md) — Categories, muscles, variants, and seed exercises
- [Backend Improvements](server/docs/IMPROVEMENTS.md) — Planned enhancements

## License

MIT
