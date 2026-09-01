export interface PredefinedExercise {
  name: string;
  category: string;
  muscleGroup: string[];
}

export interface CatalogExercise extends PredefinedExercise {
  id: string;
}

export const EXERCISE_CATEGORIES = {
  CHEST: "Chest",
  BACK: "Back",
  SHOULDERS: "Shoulders",
  ARMS: "Arms",
  LEGS: "Legs",
  CORE: "Core",
  CARDIO: "Cardio",
  FULL_BODY: "Full Body",
} as const;

export const PREDEFINED_EXERCISES: PredefinedExercise[] = [
  // Chest
  {
    name: "Bench Press",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Incline Bench Press",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Upper Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Decline Bench Press",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Lower Chest", "Triceps"],
  },
  {
    name: "Dumbbell Press",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Incline Dumbbell Press",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Upper Chest", "Triceps"],
  },
  {
    name: "Chest Fly",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest"],
  },
  {
    name: "Cable Fly",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest"],
  },
  {
    name: "Push-ups",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest", "Triceps", "Core"],
  },
  {
    name: "Dips (Chest)",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest", "Triceps"],
  },
  {
    name: "Pec Deck",
    category: EXERCISE_CATEGORIES.CHEST,
    muscleGroup: ["Chest"],
  },

  // Back
  {
    name: "Deadlift",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Back", "Glutes", "Hamstrings", "Core"],
  },
  {
    name: "Bent Over Row",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Back", "Biceps"],
  },
  {
    name: "T-Bar Row",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Back", "Biceps"],
  },
  {
    name: "Lat Pulldown",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Lats", "Biceps"],
  },
  {
    name: "Pull-ups",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Lats", "Biceps", "Core"],
  },
  {
    name: "Chin-ups",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Lats", "Biceps"],
  },
  {
    name: "Seated Cable Row",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Back", "Biceps"],
  },
  {
    name: "Single Arm Dumbbell Row",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Back", "Biceps"],
  },
  {
    name: "Face Pulls",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Rear Delts", "Upper Back"],
  },
  {
    name: "Hyperextensions",
    category: EXERCISE_CATEGORIES.BACK,
    muscleGroup: ["Lower Back", "Glutes"],
  },

  // Shoulders
  {
    name: "Shoulder Press",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Shoulders", "Triceps"],
  },
  {
    name: "Arnold Press",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Shoulders", "Triceps"],
  },
  {
    name: "Lateral Raises",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Side Delts"],
  },
  {
    name: "Front Raises",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Front Delts"],
  },
  {
    name: "Rear Delt Fly",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Rear Delts"],
  },
  {
    name: "Upright Row",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Shoulders", "Traps"],
  },
  {
    name: "Shrugs",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Traps"],
  },
  {
    name: "Cable Lateral Raises",
    category: EXERCISE_CATEGORIES.SHOULDERS,
    muscleGroup: ["Side Delts"],
  },

  // Arms
  {
    name: "Bicep Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Biceps"],
  },
  {
    name: "Hammer Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Biceps", "Forearms"],
  },
  {
    name: "Preacher Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Biceps"],
  },
  {
    name: "Concentration Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Biceps"],
  },
  {
    name: "Cable Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Biceps"],
  },
  {
    name: "Tricep Dips",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Triceps"],
  },
  {
    name: "Tricep Pushdown",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Triceps"],
  },
  {
    name: "Overhead Tricep Extension",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Triceps"],
  },
  {
    name: "Skull Crushers",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Triceps"],
  },
  {
    name: "Close Grip Bench Press",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Triceps", "Chest"],
  },
  {
    name: "Wrist Curls",
    category: EXERCISE_CATEGORIES.ARMS,
    muscleGroup: ["Forearms"],
  },

  // Legs
  {
    name: "Squats",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Glutes", "Core"],
  },
  {
    name: "Front Squats",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Core"],
  },
  {
    name: "Leg Press",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Glutes"],
  },
  {
    name: "Leg Extension",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads"],
  },
  {
    name: "Leg Curl",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Hamstrings"],
  },
  {
    name: "Romanian Deadlift",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Lunges",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Glutes"],
  },
  {
    name: "Bulgarian Split Squats",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Glutes"],
  },
  {
    name: "Calf Raises",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Calves"],
  },
  {
    name: "Seated Calf Raises",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Calves"],
  },
  {
    name: "Hack Squats",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Quads", "Glutes"],
  },
  {
    name: "Glute Bridges",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Glutes", "Hamstrings"],
  },
  {
    name: "Hip Thrusts",
    category: EXERCISE_CATEGORIES.LEGS,
    muscleGroup: ["Glutes", "Hamstrings"],
  },

  // Core
  { name: "Planks", category: EXERCISE_CATEGORIES.CORE, muscleGroup: ["Core"] },
  {
    name: "Side Planks",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Obliques", "Core"],
  },
  {
    name: "Crunches",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Abs"],
  },
  {
    name: "Bicycle Crunches",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Abs", "Obliques"],
  },
  {
    name: "Russian Twists",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Obliques", "Core"],
  },
  {
    name: "Leg Raises",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Lower Abs"],
  },
  {
    name: "Hanging Leg Raises",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Lower Abs", "Core"],
  },
  {
    name: "Ab Wheel Rollout",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Core"],
  },
  {
    name: "Mountain Climbers",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Core", "Cardio"],
  },
  {
    name: "Cable Crunches",
    category: EXERCISE_CATEGORIES.CORE,
    muscleGroup: ["Abs"],
  },

  // Cardio
  {
    name: "Running",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Legs"],
  },
  {
    name: "Treadmill",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Legs"],
  },
  {
    name: "Cycling",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Legs"],
  },
  {
    name: "Elliptical",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Full Body"],
  },
  {
    name: "Rowing Machine",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Back", "Legs"],
  },
  {
    name: "Stair Climber",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Legs", "Glutes"],
  },
  {
    name: "Jump Rope",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Calves"],
  },
  {
    name: "Burpees",
    category: EXERCISE_CATEGORIES.CARDIO,
    muscleGroup: ["Cardio", "Full Body"],
  },

  // Full Body
  {
    name: "Clean and Press",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Full Body"],
  },
  {
    name: "Thrusters",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Full Body"],
  },
  {
    name: "Turkish Get-ups",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Full Body", "Core"],
  },
  {
    name: "Kettlebell Swings",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Full Body", "Glutes"],
  },
  {
    name: "Battle Ropes",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Full Body", "Cardio"],
  },
  {
    name: "Box Jumps",
    category: EXERCISE_CATEGORIES.FULL_BODY,
    muscleGroup: ["Legs", "Cardio"],
  },
];

export const TARGET_MUSCLES = Array.from(
  new Set(PREDEFINED_EXERCISES.flatMap((exercise) => exercise.muscleGroup)),
).sort((a, b) => a.localeCompare(b));

export const createExerciseCatalog = (): CatalogExercise[] =>
  PREDEFINED_EXERCISES.map((exercise, index) => ({
    ...exercise,
    id: `${exercise.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
  }));
