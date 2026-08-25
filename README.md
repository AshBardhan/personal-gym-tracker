# Personal Gym Tracker

A full-stack MERN application with TypeScript support for tracking gym workouts and exercises.

## Features Overview

- **Workout Management** - Create, edit, and delete workouts with optional titles
- **Exercise Tracking** - Track multiple exercises per workout with sets (reps and weight)
- **Date Organization** - Organize workouts by date for easy tracking
- **Inline Editing** - Real-time validation with visual feedback
- **Modern UI** - Professional interface with Tailwind CSS and Lucide icons
- **Data Persistence** - MongoDB database for reliable storage
- **API Mocking** - MSW integration for offline development
- **Type Safety** - Full TypeScript support across the stack

## Routing

### Application Routes (Frontend)

| Route | Component | Description |
| ----- | --------- | ----------- |
| `/` | WorkoutListPage | Home page - workout grid view |
| `/workouts` | WorkoutListPage | All workouts list |
| `/workouts/new` | WorkoutFormPage | Create new workout |
| `/workouts/:id` | WorkoutDetailPage | View workout details |
| `/workouts/:id/edit` | WorkoutFormPage | Edit existing workout |

### API Routes (Backend)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users` | Create new user |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |
| `GET` | `/api/workouts/:userId` | Get all workouts for user |
| `GET` | `/api/workouts/detail/:id` | Get workout by ID |
| `POST` | `/api/workouts` | Create new workout |
| `PUT` | `/api/workouts/:id` | Update workout |
| `DELETE` | `/api/workouts/:id` | Delete workout |

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **TypeScript** - Static typing

### Frontend

- **React 19** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS
- **MSW** - API mocking for development

## Project Structure

```text
personal-gym-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── stores/         # State management
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── mocks/          # MSW handlers
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utilities
│   ├── docs/               # Frontend documentation
│   └── package.json
└── server/                 # Express backend
    ├── src/
    │   ├── models/         # Mongoose models
    │   ├── routes/         # API routes
    │   ├── config/         # Configuration
    │   └── server.ts       # Entry point
    ├── docs/               # Backend documentation
    └── package.json
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or cloud connection)
- npm or yarn

### Quick Start

```bash
# Install root tooling and application dependencies.
npm install
npm install --prefix client
npm install --prefix server

# Configure server/.env for MongoDB and client/.env for the API and MSW.

# Start local MongoDB and optionally create the demo user.
sudo systemctl start mongod
npm run setup --prefix server

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

## Documentation

### Frontend Documentation

- [Client README](client/README.md) - Frontend overview, tech stack, and structure
- [Frontend ADR](client/docs/ADR.md) - Architecture decisions and rationale
- [Frontend Improvements](client/docs/IMPROVEMENTS.md) - Planned enhancements

### Backend Documentation

- [Server README](server/README.md) - Backend overview, tech stack, and structure
- [Backend ADR](server/docs/ADR.md) - Architecture decisions and rationale
- [Database Setup](server/docs/DATABASE_SETUP.md) - MongoDB setup and schema
- [Backend Improvements](server/docs/IMPROVEMENTS.md) - Planned enhancements

## License

MIT
