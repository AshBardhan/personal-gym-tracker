# Gym Tracker - Backend

Express + TypeScript backend API for the Personal Gym Tracker application with MongoDB database.

## Features Overview

### Core Features

- **RESTful API** — Standard REST endpoints for CRUD operations
- **Exercise Catalog** — Shared exercise list with embedded equipment variants
- **Workout Management** — Full CRUD with catalog-backed exercise snapshots and sets
- **Structured Responses** — All endpoints return `ApiResponse<T>` (`success`, `data`, `error`)
- **Database Seeding** — `npm run seed` loads demo user, 68 exercises, and 10 workouts
- **CORS Enabled** — Cross-origin resource sharing configured for development

### Technical Features

- **TypeScript** — Full type safety across the codebase
- **ESM Modules** — Modern ES2020 module system with `@/` path aliases
- **MongoDB** — NoSQL document database with Mongoose ODM
- **Environment Config** — dotenv for configuration management
- **Hot Reload** — nodemon + tsx for development server

## Tech Stack

| Category | Technology | Version | Purpose |
| -------- | ---------- | ------- | ------- |
| **Runtime** | Node.js | 22+ | JavaScript runtime |
| **Framework** | Express.js | 4.18 | Web application framework |
| **Language** | TypeScript | 5.9 | Static typing |
| **Database** | MongoDB | Latest | NoSQL document database |
| **ODM** | Mongoose | 8.0 | MongoDB object modeling |
| **Middleware** | CORS | 2.8 | Cross-origin support |
| **Config** | dotenv | 16.3 | Environment variables |
| **Dev Tools** | tsx | 4.x | TypeScript execution |
| **Dev Tools** | nodemon | 3.1 | Development server |

See [Architecture Decision Records](docs/ADR.md) for technology rationale.

## Project Structure

```text
server/
├── src/
│   ├── models/                      # Mongoose models
│   │   ├── User.ts                  # User schema (isAdmin, passwordHash placeholder)
│   │   ├── Exercise.ts              # Catalog with embedded variants
│   │   ├── Workout.ts               # Session with embedded exercise snapshots
│   │   └── Set.ts                   # Set subdocument schema
│   │
│   ├── routes/                      # API routes
│   │   ├── users.ts                 # User endpoints
│   │   ├── exercises.ts             # Exercise catalog endpoints
│   │   └── workouts.ts              # Workout endpoints
│   │
│   ├── seed/                        # Database seed data & script
│   │   ├── index.ts                 # Drop collections and seed
│   │   └── data/                    # User, exercise, and workout fixtures
│   │
│   ├── types/                       # Shared types
│   │
│   ├── utils/                       # Helper functions
│   │
│   ├── config/                      # Configuration
│   │   └── db.ts                    # MongoDB connection
│   │
│   └── server.ts                    # Express server setup
│
├── dist/                            # Compiled JavaScript (ES2020)
│
├── docs/                            # Documentation
│   ├── ADR.md                       # Architecture decisions
│   ├── DATABASE_SETUP.md            # Database configuration
│   └── IMPROVEMENTS.md              # Planned enhancements
│
├── .env                             # Environment variables (not in git)
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 22+ and npm 9+
- MongoDB (for local setup)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI
```

### Environment Variables

Create `.env` file in server directory:

```text
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gym-tracker

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Development

```bash
# Seed demo data (drops and recreates users, exercises, workouts)
npm run seed

# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### API Access

- API Base URL: `http://localhost:5000`
- API Routes: `http://localhost:5000/api`

## API Routes

All endpoints return `ApiResponse<T>`:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "message": "..." } }
```

There is **no authentication or authorization** yet — callers supply `userId` directly. Planned MVP routes are tracked in [MVP_ROADMAP.md](../MVP_ROADMAP.md).

### Status

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/` | API status message |

### Users

| Method | Endpoint | Description | Request Body |
| ------ | -------- | ----------- | ------------ |
| `GET` | `/api/users` | List all users | None |
| `GET` | `/api/users/:id` | Get user by ID | None |
| `POST` | `/api/users` | Create user | `{ name, email }` |
| `PUT` | `/api/users/:id` | Update user | `{ name?, email? }` |
| `DELETE` | `/api/users/:id` | Delete user | None |

### Exercises

| Method | Endpoint | Description | Request Body |
| ------ | -------- | ----------- | ------------ |
| `GET` | `/api/exercises` | List catalog (sorted by name) | None |
| `GET` | `/api/exercises/:id` | Get exercise by ID | None |
| `POST` | `/api/exercises` | Create exercise | See Exercise model |
| `PUT` | `/api/exercises/:id` | Update exercise | Partial exercise |
| `DELETE` | `/api/exercises/:id` | Delete exercise | None |

### Workouts

| Method | Endpoint | Description | Request Body |
| ------ | -------- | ----------- | ------------ |
| `GET` | `/api/workouts/:userId` | List workouts for a user (newest date first) | None |
| `GET` | `/api/workouts/detail/:id` | Get workout by ID | None |
| `POST` | `/api/workouts` | Create workout | `{ userId, title, date?, memo?, exercises? }` |
| `PUT` | `/api/workouts/:id` | Update workout | `{ title?, date?, memo?, exercises? }` |
| `DELETE` | `/api/workouts/:id` | Delete workout | None |

**Workout `exercises` shape:** denormalized snapshots with `exerciseId`, `variantId`, name, category, muscles, equipment, metrics, and `sets[]` (`type`, `reps?`, `weight?`, `duration?`).

## Documentation

- [Architecture Decision Records](docs/ADR.md) — Technology choices and rationale
- [Database Setup](docs/DATABASE_SETUP.md) — MongoDB configuration and schema
- [Exercise Catalog](../EXERCISES.md) — Categories, muscles, variants, and seed exercises
- [Improvements](docs/IMPROVEMENTS.md) — Planned enhancements and roadmap
- [MVP Roadmap](../MVP_ROADMAP.md) — Parallel task and route checklist
- [Main README](../README.md) — Project overview and setup
- [Client Documentation](../client/README.md) — Frontend application documentation
