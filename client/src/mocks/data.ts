import { Exercise, Workout } from "@/types/workout";

// Mock user ID
export const MOCK_USER_ID = "673092a6fd2a34e8e4b91234";

const sets = (
  ...entries: Array<[reps: number, weight: number]>
): Exercise["sets"] => entries.map(([reps, weight]) => ({ reps, weight }));

const exercise = (
  name: string,
  category: string,
  muscleGroup: string[],
  setEntries: Array<[reps: number, weight: number]>,
): Exercise => ({
  name,
  category,
  muscleGroup,
  sets: sets(...setEntries),
});

const workout = (
  id: string,
  title: string,
  date: string,
  exercises: Exercise[],
): Workout => ({
  _id: id,
  userId: MOCK_USER_ID,
  title,
  date: new Date(`${date}T12:00:00.000Z`).toISOString(),
  exercises,
  createdAt: new Date(`${date}T12:00:00.000Z`).toISOString(),
});

/**
 * Mock workouts: 5 days/week (Mon–Fri) for previous week + this week.
 * Relative to Sat Aug 29, 2026:
 * - Previous week: Aug 17–21
 * - This week: Aug 24–28
 */
export const mockWorkouts: Workout[] = [
  // --- This week (Aug 24–28) ---
  workout("10", "Core and Shoulders", "2026-08-28", [
    exercise(
      "Planks",
      "Core",
      ["Core"],
      [
        [60, 0],
        [45, 0],
        [45, 0],
      ],
    ),
    exercise(
      "Hanging Leg Raises",
      "Core",
      ["Lower Abs", "Core"],
      [
        [12, 0],
        [10, 0],
        [10, 0],
      ],
    ),
    exercise(
      "Russian Twists",
      "Core",
      ["Obliques", "Core"],
      [
        [20, 10],
        [20, 10],
        [16, 12],
      ],
    ),
    exercise(
      "Shoulder Press",
      "Shoulders",
      ["Shoulders", "Triceps"],
      [
        [12, 30],
        [10, 35],
        [8, 37.5],
      ],
    ),
    exercise(
      "Lateral Raises",
      "Shoulders",
      ["Side Delts"],
      [
        [15, 10],
        [12, 12],
        [12, 12],
      ],
    ),
    exercise(
      "Face Pulls",
      "Back",
      ["Rear Delts", "Upper Back"],
      [
        [15, 20],
        [15, 22.5],
        [12, 25],
      ],
    ),
  ]),
  workout("9", "Arms", "2026-08-27", [
    exercise(
      "Bicep Curls",
      "Arms",
      ["Biceps"],
      [
        [12, 15],
        [10, 17.5],
        [10, 17.5],
      ],
    ),
    exercise(
      "Hammer Curls",
      "Arms",
      ["Biceps", "Forearms"],
      [
        [12, 15],
        [10, 17.5],
        [10, 17.5],
      ],
    ),
    exercise(
      "Tricep Pushdown",
      "Arms",
      ["Triceps"],
      [
        [12, 25],
        [10, 30],
        [10, 30],
      ],
    ),
    exercise(
      "Skull Crushers",
      "Arms",
      ["Triceps"],
      [
        [10, 25],
        [10, 27.5],
        [8, 30],
      ],
    ),
    exercise(
      "Cable Curls",
      "Arms",
      ["Biceps"],
      [
        [15, 20],
        [12, 22.5],
        [12, 22.5],
      ],
    ),
  ]),
  workout("8", "Legs", "2026-08-26", [
    exercise(
      "Squats",
      "Legs",
      ["Quads", "Glutes", "Core"],
      [
        [10, 100],
        [8, 110],
        [6, 120],
      ],
    ),
    exercise(
      "Romanian Deadlift",
      "Legs",
      ["Hamstrings", "Glutes", "Lower Back"],
      [
        [10, 80],
        [8, 90],
        [8, 90],
      ],
    ),
    exercise(
      "Leg Press",
      "Legs",
      ["Quads", "Glutes"],
      [
        [12, 160],
        [10, 180],
        [8, 200],
      ],
    ),
    exercise(
      "Leg Curl",
      "Legs",
      ["Hamstrings"],
      [
        [12, 40],
        [10, 45],
        [10, 45],
      ],
    ),
    exercise(
      "Calf Raises",
      "Legs",
      ["Calves"],
      [
        [15, 60],
        [15, 60],
        [12, 70],
      ],
    ),
  ]),
  workout("7", "Back", "2026-08-25", [
    exercise(
      "Deadlift",
      "Back",
      ["Back", "Glutes", "Hamstrings", "Core"],
      [
        [6, 130],
        [5, 140],
        [4, 150],
      ],
    ),
    exercise(
      "Pull-ups",
      "Back",
      ["Lats", "Biceps", "Core"],
      [
        [10, 0],
        [8, 0],
        [6, 5],
      ],
    ),
    exercise(
      "Seated Cable Row",
      "Back",
      ["Back", "Biceps"],
      [
        [12, 50],
        [10, 55],
        [10, 55],
      ],
    ),
    exercise(
      "Lat Pulldown",
      "Back",
      ["Lats", "Biceps"],
      [
        [12, 55],
        [10, 60],
        [10, 60],
      ],
    ),
    exercise(
      "Single Arm Dumbbell Row",
      "Back",
      ["Back", "Biceps"],
      [
        [10, 30],
        [10, 32.5],
        [8, 35],
      ],
    ),
  ]),
  workout("6", "Chest", "2026-08-24", [
    exercise(
      "Bench Press",
      "Chest",
      ["Chest", "Triceps", "Shoulders"],
      [
        [10, 80],
        [8, 85],
        [6, 90],
      ],
    ),
    exercise(
      "Incline Dumbbell Press",
      "Chest",
      ["Upper Chest", "Triceps"],
      [
        [10, 30],
        [10, 32.5],
        [8, 35],
      ],
    ),
    exercise(
      "Chest Fly",
      "Chest",
      ["Chest"],
      [
        [12, 15],
        [12, 15],
        [10, 17.5],
      ],
    ),
    exercise(
      "Cable Fly",
      "Chest",
      ["Chest"],
      [
        [15, 12.5],
        [12, 15],
        [12, 15],
      ],
    ),
    exercise(
      "Dips (Chest)",
      "Chest",
      ["Chest", "Triceps"],
      [
        [12, 0],
        [10, 0],
        [8, 5],
      ],
    ),
  ]),

  // --- Previous week (Aug 17–21) ---
  workout("5", "Shoulders and Arms", "2026-08-21", [
    exercise(
      "Shoulder Press",
      "Shoulders",
      ["Shoulders", "Triceps"],
      [
        [10, 35],
        [8, 40],
        [8, 40],
      ],
    ),
    exercise(
      "Lateral Raises",
      "Shoulders",
      ["Side Delts"],
      [
        [15, 10],
        [12, 12],
        [12, 12],
      ],
    ),
    exercise(
      "Rear Delt Fly",
      "Shoulders",
      ["Rear Delts"],
      [
        [15, 8],
        [12, 10],
        [12, 10],
      ],
    ),
    exercise(
      "Bicep Curls",
      "Arms",
      ["Biceps"],
      [
        [12, 15],
        [10, 17.5],
        [10, 17.5],
      ],
    ),
    exercise(
      "Tricep Pushdown",
      "Arms",
      ["Triceps"],
      [
        [12, 25],
        [10, 30],
        [10, 30],
      ],
    ),
    exercise(
      "Hammer Curls",
      "Arms",
      ["Biceps", "Forearms"],
      [
        [12, 15],
        [10, 17.5],
        [10, 17.5],
      ],
    ),
  ]),
  workout("4", "Chest and Back", "2026-08-20", [
    exercise(
      "Bench Press",
      "Chest",
      ["Chest", "Triceps", "Shoulders"],
      [
        [10, 75],
        [8, 80],
        [6, 85],
      ],
    ),
    exercise(
      "Incline Bench Press",
      "Chest",
      ["Upper Chest", "Triceps", "Shoulders"],
      [
        [10, 60],
        [8, 65],
        [8, 65],
      ],
    ),
    exercise(
      "Bent Over Row",
      "Back",
      ["Back", "Biceps"],
      [
        [10, 60],
        [8, 70],
        [8, 70],
      ],
    ),
    exercise(
      "Lat Pulldown",
      "Back",
      ["Lats", "Biceps"],
      [
        [12, 50],
        [10, 55],
        [10, 55],
      ],
    ),
    exercise(
      "Cable Fly",
      "Chest",
      ["Chest"],
      [
        [15, 12.5],
        [12, 15],
        [12, 15],
      ],
    ),
  ]),
  workout("3", "Legs", "2026-08-19", [
    exercise(
      "Squats",
      "Legs",
      ["Quads", "Glutes", "Core"],
      [
        [10, 95],
        [8, 105],
        [6, 115],
      ],
    ),
    exercise(
      "Leg Press",
      "Legs",
      ["Quads", "Glutes"],
      [
        [12, 150],
        [10, 170],
        [8, 180],
      ],
    ),
    exercise(
      "Lunges",
      "Legs",
      ["Quads", "Glutes"],
      [
        [10, 20],
        [10, 20],
        [8, 22.5],
      ],
    ),
    exercise(
      "Leg Extension",
      "Legs",
      ["Quads"],
      [
        [12, 45],
        [12, 45],
        [10, 50],
      ],
    ),
    exercise(
      "Seated Calf Raises",
      "Legs",
      ["Calves"],
      [
        [15, 40],
        [15, 40],
        [12, 45],
      ],
    ),
  ]),
  workout("2", "Pull", "2026-08-18", [
    exercise(
      "Deadlift",
      "Back",
      ["Back", "Glutes", "Hamstrings", "Core"],
      [
        [6, 125],
        [5, 135],
        [4, 145],
      ],
    ),
    exercise(
      "Pull-ups",
      "Back",
      ["Lats", "Biceps", "Core"],
      [
        [8, 0],
        [8, 0],
        [6, 0],
      ],
    ),
    exercise(
      "Seated Cable Row",
      "Back",
      ["Back", "Biceps"],
      [
        [12, 45],
        [10, 50],
        [10, 50],
      ],
    ),
    exercise(
      "Face Pulls",
      "Back",
      ["Rear Delts", "Upper Back"],
      [
        [15, 20],
        [15, 20],
        [12, 22.5],
      ],
    ),
    exercise(
      "Bicep Curls",
      "Arms",
      ["Biceps"],
      [
        [12, 15],
        [10, 17.5],
        [10, 17.5],
      ],
    ),
    exercise(
      "Hammer Curls",
      "Arms",
      ["Biceps", "Forearms"],
      [
        [12, 12.5],
        [10, 15],
        [10, 15],
      ],
    ),
  ]),
  workout("1", "Push", "2026-08-17", [
    exercise(
      "Bench Press",
      "Chest",
      ["Chest", "Triceps", "Shoulders"],
      [
        [10, 75],
        [8, 82.5],
        [6, 87.5],
      ],
    ),
    exercise(
      "Shoulder Press",
      "Shoulders",
      ["Shoulders", "Triceps"],
      [
        [10, 30],
        [8, 35],
        [8, 35],
      ],
    ),
    exercise(
      "Incline Dumbbell Press",
      "Chest",
      ["Upper Chest", "Triceps"],
      [
        [10, 28],
        [10, 30],
        [8, 32.5],
      ],
    ),
    exercise(
      "Lateral Raises",
      "Shoulders",
      ["Side Delts"],
      [
        [15, 8],
        [12, 10],
        [12, 10],
      ],
    ),
    exercise(
      "Tricep Pushdown",
      "Arms",
      ["Triceps"],
      [
        [12, 25],
        [10, 27.5],
        [10, 27.5],
      ],
    ),
    exercise(
      "Overhead Tricep Extension",
      "Arms",
      ["Triceps"],
      [
        [12, 20],
        [10, 22.5],
        [10, 22.5],
      ],
    ),
  ]),
];

// Mock user data
export const mockUser = {
  _id: MOCK_USER_ID,
  name: "Demo User",
  email: "demo@gymtracker.com",
  createdAt: new Date("2024-01-01").toISOString(),
};
