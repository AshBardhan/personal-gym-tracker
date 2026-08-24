# Personal Gym Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application with TypeScript for tracking gym workouts and exercises.

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
|-------|-----------|-------------|
| `/` | WorkoutListPage | Home page - workout grid view |
| `/workouts` | WorkoutListPage | All workouts list |
| `/workouts/new` | WorkoutFormPage | Create new workout |
| `/workouts/:id` | WorkoutDetailPage | View workout details |
| `/workouts/:id/edit` | WorkoutFormPage | Edit existing workout |

### API Routes (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
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
│
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

**Terminal 1 - Server:**

```bash
# Enter the server directory and install dependencies
cd server
npm install

# Create server/.env with the MongoDB connection settings

# Start MongoDB if using a local database
sudo systemctl start mongod

# Create the demo user (optional)
npm run setup

# Start the backend
npm run dev
```

**Terminal 2 - Client:**

```bash
# Enter the client directory and install dependencies
cd client
npm install

# Create client/.env with the API and MSW settings

# Start the frontend
npm run dev
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

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

## Development

### Development Modes

**With Mock API (Default)** - No backend required:
```bash
cd client
npm run dev
```

**With Real API** - Backend must be running:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev
```

### Available Scripts

**Server Commands:**
```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm start        # Start production server
npm run setup    # Create demo user
```

**Client Commands:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Configuration

### Server Environment (.env)
```text
MONGODB_URI=mongodb://localhost:27017/gym-tracker
PORT=5000
NODE_ENV=development
```

### Client Environment (.env)
```text
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MSW=true
VITE_DEMO_USER_ID=673092a6fd2a34e8e4b91234
```

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check port 5000 availability: `lsof -i :5000`
- Verify `.env` file exists in server directory

### Frontend Issues
- Clear browser cache and reload
- Check browser console for errors
- Verify backend is running (if not using MSW)

## Legacy Project Structure

> **Note:** For detailed project structure, see [client/README.md](client/README.md) and [server/README.md](server/README.md)

## License

MIT

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

