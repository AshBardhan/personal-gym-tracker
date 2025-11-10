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
├── services/        # API service layer
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

For more information, visit the [main README](../README.md).
