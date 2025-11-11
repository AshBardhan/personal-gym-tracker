import { Workout } from "../types";

// Mock user ID
export const MOCK_USER_ID = "673092a6fd2a34e8e4b91234";

// Mock workouts data
export const mockWorkouts: Workout[] = [
  {
    _id: "1",
    userId: MOCK_USER_ID,
    title: "Upper Body Strength",
    date: new Date("2024-11-10").toISOString(),
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { reps: 10, weight: 80 },
          { reps: 8, weight: 85 },
          { reps: 6, weight: 90 },
        ],
      },
      {
        name: "Shoulder Press",
        sets: [
          { reps: 12, weight: 30 },
          { reps: 10, weight: 35 },
          { reps: 8, weight: 40 },
        ],
      },
      {
        name: "Bicep Curls",
        sets: [
          { reps: 15, weight: 15 },
          { reps: 12, weight: 17.5 },
          { reps: 10, weight: 20 },
        ],
      },
    ],
    createdAt: new Date("2024-11-10").toISOString(),
  },
  {
    _id: "2",
    userId: MOCK_USER_ID,
    title: "Leg Day",
    date: new Date("2024-11-09").toISOString(),
    exercises: [
      {
        name: "Squats",
        sets: [
          { reps: 10, weight: 100 },
          { reps: 8, weight: 110 },
          { reps: 6, weight: 120 },
        ],
      },
      {
        name: "Leg Press",
        sets: [
          { reps: 12, weight: 150 },
          { reps: 10, weight: 160 },
          { reps: 8, weight: 170 },
        ],
      },
    ],
    createdAt: new Date("2024-11-09").toISOString(),
  },
  {
    _id: "3",
    userId: MOCK_USER_ID,
    title: "Back & Core",
    date: new Date("2024-11-08").toISOString(),
    exercises: [
      {
        name: "Deadlifts",
        sets: [
          { reps: 8, weight: 120 },
          { reps: 6, weight: 130 },
          { reps: 5, weight: 140 },
        ],
      },
      {
        name: "Pull-ups",
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 5 },
          { reps: 6, weight: 10 },
        ],
      },
      {
        name: "Planks",
        sets: [
          { reps: 60, weight: 0 },
          { reps: 45, weight: 0 },
          { reps: 30, weight: 0 },
        ],
      },
    ],
    createdAt: new Date("2024-11-08").toISOString(),
  },
];

// Mock user data
export const mockUser = {
  _id: MOCK_USER_ID,
  name: "Demo User",
  email: "demo@gymtracker.com",
  createdAt: new Date("2024-01-01").toISOString(),
};
