# Gym Tracker - Backend

This is the Express + TypeScript backend for the Personal Gym Tracker application.

## Documentation

Please see the main [README.md](../README.md) in the root directory for complete documentation, including:

- Installation and setup instructions
- API endpoints
- Database schema
- Development guidelines

## Quick Start

```bash
# Install dependencies
npm install

# Create demo user
npm run setup

# Start development server
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- **ESM Modules** (ES2020)

## Project Structure

```
src/
├── models/              # Mongoose models
│   ├── User.ts
│   └── Workout.ts
├── routes/              # API routes
│   ├── users.ts
│   └── workouts.ts
├── config/              # Configuration
│   └── db.ts
├── server.ts            # Server entry point
└── createDemoUser.ts    # Demo user script
```

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/gym-tracker
PORT=5000
NODE_ENV=development
```

## Module System

This project uses **ES Modules (ESM)**:
- `package.json` includes `"type": "module"`
- All imports use `.js` extensions (e.g., `./routes/users.js`)
- TypeScript compiles to ES2020 modules
- Use `node --loader ts-node/esm` for running TypeScript files

For more information, visit the [main README](../README.md).
