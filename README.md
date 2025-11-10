# Personal Gym Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) application with TypeScript for tracking gym workouts and exercises.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

2. **Start MongoDB**
```bash
# Make sure MongoDB is running
sudo systemctl status mongod
# or
brew services start mongodb-community  # macOS
```

3. **Create demo user** (optional)
```bash
cd server
npm run setup
```

4. **Run the application**
```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend client
cd client
npm run dev
```

5. **Open the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Features

- Create and manage workouts with optional titles
- Track exercises with multiple sets (reps and weight)
- Date-based workout organization
- **Inline editing** with default empty exercise/set on form load
- **Real-time validation** with visual feedback (red borders)
- **Reusable components**: Input with self-contained validation, Button with variants
- **Professional UI** with Lucide React icons
- Add/Edit/Delete individual sets and exercises
- View detailed workout history
- Full TypeScript support for type safety
- **ESM modules** throughout the stack

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Static typing

### Frontend
- **React** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Zustand** - State management

## Project Structure

```
personal-gym-tracker/
├── client/                 # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── WorkoutList.tsx
│   │   │   ├── WorkoutForm.tsx
│   │   │   ├── WorkoutDetail.tsx
│   │   │   ├── Input.tsx          # Reusable input with validation
│   │   │   ├── Input.css
│   │   │   ├── Button.tsx         # Reusable button with variants
│   │   │   └── Button.css
│   │   ├── stores/         # Zustand state management
│   │   │   └── workoutFormStore.ts
│   │   ├── services/       # API service layer
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── tsconfig.json       # TypeScript config
│   └── package.json
└── server/                 # Express backend (TypeScript)
    ├── src/
    │   ├── models/         # Mongoose models
    │   │   ├── User.ts
    │   │   └── Workout.ts
    │   ├── routes/         # API routes
    │   │   ├── users.ts
    │   │   └── workouts.ts
    │   ├── config/         # Configuration files
    │   │   └── db.ts
    │   ├── server.ts       # Server entry point
    │   └── createDemoUser.ts
    ├── dist/               # Compiled JavaScript (ESM)
    ├── tsconfig.json       # TypeScript config
    └── package.json
```

## How to Use

### Creating a Workout

1. **Navigate to the app** at http://localhost:5173
2. **Click "Add Workout"** in the navigation bar
2. **Fill in workout details**:
   - Enter an optional workout title (e.g., "Upper Body Day")
   - Select the date (defaults to today)
3. **Add exercises** (inline editing):
   - A default empty exercise is provided to start
   - Enter exercise name directly in the form
   - Add sets by entering reps and weight inline
   - Click "Add Set" to add more sets to the exercise
   - Click "Add Exercise" to add another exercise
   - Remove exercises or sets using the icon buttons
4. **Real-time validation**:
   - Input fields show red borders when invalid
   - Empty exercise names or sets are filtered out on save
5. **Click "Save Workout"** to save

### Viewing Workouts

- **Home page** displays all your workouts in a grid layout
- **Click on any workout card** to view detailed information:
  - All exercises with their names
  - All sets with reps and weight for each exercise
  - Total exercise and set counts

### Managing Workouts

- **Edit**: Click "Edit Workout" on the detail page to modify exercises and sets
- **Delete**: Use the delete button on workout cards or detail page
- **Edit inline**: All exercises and sets are editable directly in the form
- **Validation**: Invalid inputs show red borders for instant feedback

## Configuration

The application uses environment variables for configuration. Edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/gym-tracker
PORT=5000
NODE_ENV=development
```

**Note**: The application currently uses a hardcoded demo userId: `673092a6fd2a34e8e4b91234`

## Troubleshooting

### Backend not starting?
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check if port 5000 is available: `lsof -i :5000`
- Verify `.env` file exists in server directory
- Check MongoDB connection string in `.env`

### Frontend not loading?
- Clear browser cache and reload
- Check browser console for errors
- Verify backend is running on port 5000
- Check for TypeScript compilation errors: `npm run build`

### Can't see workouts?
- Verify the demo userId matches: `673092a6fd2a34e8e4b91234`
- Check MongoDB connection in server logs
- Run `npm run setup` to create demo user
- Check browser network tab for API errors

### TypeScript errors?
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript version compatibility
- Run `npm run build` to see compilation errors

## Available Scripts

### Server Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run setup    # Create/verify demo user
```

### Client Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Workouts
- `GET /api/workouts/:userId` - Get all workouts for a user
- `GET /api/workouts/detail/:id` - Get workout by ID
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Example: Create a workout
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "673092a6fd2a34e8e4b91234",
    "title": "Chest Day",
    "date": "2025-11-10",
    "exercises": [
      {
        "name": "Bench Press",
        "sets": [
          { "reps": 10, "weight": 80 },
          { "reps": 8, "weight": 85 },
          { "reps": 6, "weight": 90 }
        ]
      }
    ]
  }'
```

## Database Schema

### User Model
```typescript
{
  name: string;
  email: string (unique);
  createdAt: Date;
}
```

### Workout Model
```typescript
{
  userId: ObjectId (ref: User);
  title?: string (optional);
  date: Date;
  exercises: [
    {
      name: string;
      sets: [
        {
          reps: number;
          weight: number;
        }
      ];
    }
  ];
  createdAt: Date;
}
```

## Key Features Explained

### Inline Editing with Default Items
- **Default state**: Form loads with one empty exercise containing one empty set
- **Direct editing**: All fields are editable in place - no separate input areas
- **Add on demand**: Click "Add Exercise" or "Add Set" to expand the form
- **Remove easily**: Icon buttons (Trash/X) for quick deletion
- **Smart filtering**: Empty exercises and invalid sets are automatically excluded on save

### Reusable Component Architecture
- **Input component**: Self-contained validation state, red border on error, customizable error messages
- **Button component**: Six variants (primary, secondary, danger, add, icon-only, danger-icon) for consistent styling
- **Icon integration**: Professional Lucide React SVG icons throughout the UI

### State Management with Zustand
- **Centralized form state**: Workout form state managed in a Zustand store
- **Clean component code**: Components consume store actions without prop drilling
- **Predictable updates**: Immutable state updates with clear action names
- **Easy testing**: Store logic separated from UI components
- **DevTools support**: Zustand DevTools integration for debugging

### Form Validation
- **Field-level validation**: Each input validates independently
- **Visual feedback**: Red borders appear on blur or submit for invalid fields
- **Error messages**: Clear, contextual error messages below invalid inputs
- **Submit protection**: Invalid forms cannot be submitted until errors are fixed

### ESM Module Support
- **Server**: Full ES module support with `"type": "module"` in package.json
- **TypeScript**: Configured for ES2020 module output
- **Import extensions**: All imports use `.js` extensions for ESM compatibility
- **Modern JavaScript**: Leverages latest ES features throughout

## Future Enhancements

### Short-term
- User authentication (JWT/sessions)
- Input validation and error handling
- Mobile responsive design
- Dark mode support
- Workout templates (save and reuse common workouts)

### Medium-term
- Progress tracking and analytics
- Charts and visualizations (weight progression, volume, etc.)
- Goal setting and achievement tracking
- Exercise library with suggested weights
- Search and filter workouts

### Long-term
- Photo uploads for progress tracking
- Workout reminders and notifications
- Social features (share workouts, follow friends)
- Mobile app (React Native)
- Progressive Web App (PWA)
- Workout plans and programs
- AI-powered exercise recommendations

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Keep components small and focused
- Write descriptive variable and function names

### Adding New Features
1. Update TypeScript types in `types/index.ts`
2. Add/modify Mongoose models if needed
3. Update API routes and controllers
4. Create/update React components
5. Test thoroughly before committing

### Production Deployment Checklist
- [ ] Implement authentication system
- [ ] Add comprehensive input validation
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure environment variables properly
- [ ] Add rate limiting to API endpoints
- [ ] Set up CI/CD pipeline
- [ ] Add unit and integration tests
- [ ] Optimize database queries
- [ ] Add caching layer (Redis)
- [ ] Set up logging system
- [ ] Configure HTTPS/SSL
- [ ] Add database backups

## License

ISC

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Contact

For questions or suggestions, please open an issue on the repository.

---

**Happy tracking!**
