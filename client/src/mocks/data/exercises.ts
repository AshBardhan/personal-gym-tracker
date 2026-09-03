import {
  Equipment,
  Exercise,
  ExerciseCategory,
  ExerciseMetric,
  ExerciseVariant,
  MuscleGroup,
  WorkoutExercise,
} from "@/types/entities";

const seededAt = "2024-01-01T00:00:00.000Z";

const WR: ExerciseMetric[] = ["weight", "reps"];
const R: ExerciseMetric[] = ["reps"];
const D: ExerciseMetric[] = ["duration"];
const RW: ExerciseMetric[] = ["reps", "weight"];

export const exerciseId = (slug: string) => `ex-${slug}`;

export const variantId = (slug: string, equipment: Equipment) =>
  `var-${slug}-${equipment}`;

type SeedRow = {
  slug: string;
  name: string;
  category: ExerciseCategory;
  primary: MuscleGroup;
  secondary?: MuscleGroup[];
  equipment: Equipment;
  metrics: ExerciseMetric[];
  variantName?: string;
};

const PREDEFINED: SeedRow[] = [
  // Chest
  {
    slug: "bench-press",
    name: "Bench Press",
    category: "chest",
    primary: "chest",
    secondary: ["triceps", "front_delts"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "incline-bench-press",
    name: "Incline Bench Press",
    category: "chest",
    primary: "upper_chest",
    secondary: ["triceps", "front_delts"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "decline-bench-press",
    name: "Decline Bench Press",
    category: "chest",
    primary: "lower_chest",
    secondary: ["triceps"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "chest-fly",
    name: "Chest Fly",
    category: "chest",
    primary: "chest",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "push-ups",
    name: "Push-ups",
    category: "chest",
    primary: "chest",
    secondary: ["triceps", "abs"],
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "pec-deck",
    name: "Pec Deck",
    category: "chest",
    primary: "chest",
    equipment: "machine",
    metrics: WR,
  },

  // Back
  {
    slug: "deadlift",
    name: "Deadlift",
    category: "back",
    primary: "upper_back",
    secondary: ["glutes", "hamstrings", "lower_back", "abs"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "bent-over-row",
    name: "Bent Over Row",
    category: "back",
    primary: "upper_back",
    secondary: ["lats", "biceps"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "t-bar-row",
    name: "T-Bar Row",
    category: "back",
    primary: "upper_back",
    secondary: ["lats", "biceps"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    category: "back",
    primary: "lats",
    secondary: ["biceps", "upper_back"],
    equipment: "cable",
    metrics: WR,
  },
  {
    slug: "pull-ups",
    name: "Pull-ups",
    category: "back",
    primary: "lats",
    secondary: ["biceps", "abs"],
    equipment: "body_weight",
    metrics: RW,
  },
  {
    slug: "chin-ups",
    name: "Chin-ups",
    category: "back",
    primary: "lats",
    secondary: ["biceps"],
    equipment: "body_weight",
    metrics: RW,
  },
  {
    slug: "seated-row",
    name: "Seated Row",
    category: "back",
    primary: "upper_back",
    secondary: ["lats", "biceps"],
    equipment: "cable",
    metrics: WR,
  },
  {
    slug: "face-pulls",
    name: "Face Pulls",
    category: "back",
    primary: "rear_delts",
    secondary: ["upper_back"],
    equipment: "cable",
    metrics: WR,
  },
  {
    slug: "hyperextensions",
    name: "Hyperextensions",
    category: "back",
    primary: "lower_back",
    secondary: ["glutes"],
    equipment: "body_weight",
    metrics: R,
  },

  // Shoulders
  {
    slug: "shoulder-press",
    name: "Shoulder Press",
    category: "shoulders",
    primary: "front_delts",
    secondary: ["triceps", "side_delts"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "arnold-press",
    name: "Arnold Press",
    category: "shoulders",
    primary: "front_delts",
    secondary: ["side_delts", "triceps"],
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "lateral-raises",
    name: "Lateral Raises",
    category: "shoulders",
    primary: "side_delts",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "front-raises",
    name: "Front Raises",
    category: "shoulders",
    primary: "front_delts",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "rear-delt-fly",
    name: "Rear Delt Fly",
    category: "shoulders",
    primary: "rear_delts",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "upright-row",
    name: "Upright Row",
    category: "shoulders",
    primary: "side_delts",
    secondary: ["traps"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "shrugs",
    name: "Shrugs",
    category: "shoulders",
    primary: "traps",
    equipment: "barbell",
    metrics: WR,
  },

  // Arms
  {
    slug: "bicep-curls",
    name: "Bicep Curls",
    category: "arms",
    primary: "biceps",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "hammer-curls",
    name: "Hammer Curls",
    category: "arms",
    primary: "biceps",
    secondary: ["forearms"],
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "preacher-curls",
    name: "Preacher Curls",
    category: "arms",
    primary: "biceps",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "concentration-curls",
    name: "Concentration Curls",
    category: "arms",
    primary: "biceps",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "tricep-dips",
    name: "Tricep Dips",
    category: "arms",
    primary: "triceps",
    equipment: "body_weight",
    metrics: RW,
  },
  {
    slug: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: "arms",
    primary: "triceps",
    equipment: "cable",
    metrics: WR,
  },
  {
    slug: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    category: "arms",
    primary: "triceps",
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "skull-crushers",
    name: "Skull Crushers",
    category: "arms",
    primary: "triceps",
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "close-grip-bench-press",
    name: "Close Grip Bench Press",
    category: "arms",
    primary: "triceps",
    secondary: ["chest"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "wrist-curls",
    name: "Wrist Curls",
    category: "arms",
    primary: "forearms",
    equipment: "barbell",
    metrics: WR,
  },

  // Legs
  {
    slug: "squats",
    name: "Squats",
    category: "legs",
    primary: "quads",
    secondary: ["glutes", "abs"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "front-squats",
    name: "Front Squats",
    category: "legs",
    primary: "quads",
    secondary: ["abs"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "leg-press",
    name: "Leg Press",
    category: "legs",
    primary: "quads",
    secondary: ["glutes"],
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "leg-extension",
    name: "Leg Extension",
    category: "legs",
    primary: "quads",
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "leg-curl",
    name: "Leg Curl",
    category: "legs",
    primary: "hamstrings",
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "legs",
    primary: "hamstrings",
    secondary: ["glutes", "lower_back"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "lunges",
    name: "Lunges",
    category: "legs",
    primary: "quads",
    secondary: ["glutes"],
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "bulgarian-split-squats",
    name: "Bulgarian Split Squats",
    category: "legs",
    primary: "quads",
    secondary: ["glutes"],
    equipment: "dumbbell",
    metrics: WR,
  },
  {
    slug: "calf-raises",
    name: "Calf Raises",
    category: "legs",
    primary: "calves",
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "seated-calf-raises",
    name: "Seated Calf Raises",
    category: "legs",
    primary: "calves",
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "hack-squats",
    name: "Hack Squats",
    category: "legs",
    primary: "quads",
    secondary: ["glutes"],
    equipment: "machine",
    metrics: WR,
  },
  {
    slug: "glute-bridges",
    name: "Glute Bridges",
    category: "legs",
    primary: "glutes",
    secondary: ["hamstrings"],
    equipment: "body_weight",
    metrics: RW,
  },
  {
    slug: "hip-thrusts",
    name: "Hip Thrusts",
    category: "legs",
    primary: "glutes",
    secondary: ["hamstrings"],
    equipment: "barbell",
    metrics: WR,
  },

  // Core
  {
    slug: "planks",
    name: "Planks",
    category: "core",
    primary: "abs",
    equipment: "body_weight",
    metrics: D,
  },
  {
    slug: "side-planks",
    name: "Side Planks",
    category: "core",
    primary: "obliques",
    secondary: ["abs"],
    equipment: "body_weight",
    metrics: D,
  },
  {
    slug: "crunches",
    name: "Crunches",
    category: "core",
    primary: "abs",
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "bicycle-crunches",
    name: "Bicycle Crunches",
    category: "core",
    primary: "abs",
    secondary: ["obliques"],
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "russian-twists",
    name: "Russian Twists",
    category: "core",
    primary: "obliques",
    secondary: ["abs"],
    equipment: "body_weight",
    metrics: RW,
  },
  {
    slug: "leg-raises",
    name: "Leg Raises",
    category: "core",
    primary: "abs",
    secondary: ["hip_flexors"],
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "hanging-leg-raises",
    name: "Hanging Leg Raises",
    category: "core",
    primary: "abs",
    secondary: ["hip_flexors"],
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "core",
    primary: "abs",
    equipment: "body_weight",
    metrics: R,
  },
  {
    slug: "mountain-climbers",
    name: "Mountain Climbers",
    category: "core",
    primary: "abs",
    secondary: ["hip_flexors"],
    equipment: "body_weight",
    metrics: R,
  },

  // Cardio
  {
    slug: "running",
    name: "Running",
    category: "cardio",
    primary: "quads",
    secondary: ["calves"],
    equipment: "body_weight",
    metrics: D,
  },
  {
    slug: "treadmill",
    name: "Treadmill",
    category: "cardio",
    primary: "quads",
    secondary: ["calves"],
    equipment: "machine",
    metrics: D,
  },
  {
    slug: "cycling",
    name: "Cycling",
    category: "cardio",
    primary: "quads",
    secondary: ["calves"],
    equipment: "machine",
    metrics: D,
  },
  {
    slug: "elliptical",
    name: "Elliptical",
    category: "cardio",
    primary: "quads",
    secondary: ["glutes", "calves"],
    equipment: "machine",
    metrics: D,
  },
  {
    slug: "rowing",
    name: "Rowing",
    category: "cardio",
    primary: "lats",
    secondary: ["quads", "upper_back"],
    equipment: "machine",
    metrics: D,
  },
  {
    slug: "stair-climber",
    name: "Stair Climber",
    category: "cardio",
    primary: "quads",
    secondary: ["glutes", "calves"],
    equipment: "machine",
    metrics: D,
  },
  {
    slug: "jump-rope",
    name: "Jump Rope",
    category: "cardio",
    primary: "calves",
    secondary: ["quads"],
    equipment: "body_weight",
    metrics: D,
  },
  {
    slug: "burpees",
    name: "Burpees",
    category: "cardio",
    primary: "quads",
    secondary: ["chest", "abs"],
    equipment: "body_weight",
    metrics: R,
  },

  // Full body
  {
    slug: "clean-and-press",
    name: "Clean and Press",
    category: "full_body",
    primary: "quads",
    secondary: ["front_delts", "upper_back", "abs"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "thrusters",
    name: "Thrusters",
    category: "full_body",
    primary: "quads",
    secondary: ["front_delts", "abs"],
    equipment: "barbell",
    metrics: WR,
  },
  {
    slug: "turkish-get-ups",
    name: "Turkish Get-ups",
    category: "full_body",
    primary: "abs",
    secondary: ["front_delts", "glutes"],
    equipment: "kettlebell",
    metrics: WR,
  },
  {
    slug: "swings",
    name: "Swings",
    category: "full_body",
    primary: "glutes",
    secondary: ["hamstrings", "abs"],
    equipment: "kettlebell",
    metrics: WR,
  },
  {
    slug: "battle-ropes",
    name: "Battle Ropes",
    category: "full_body",
    primary: "front_delts",
    secondary: ["abs", "forearms"],
    equipment: "other",
    metrics: D,
    variantName: "Ropes",
  },
  {
    slug: "box-jumps",
    name: "Box Jumps",
    category: "full_body",
    primary: "quads",
    secondary: ["glutes", "calves"],
    equipment: "body_weight",
    metrics: R,
  },
];

const extraVariants: Array<{
  slug: string;
  equipment: Equipment;
  metrics: ExerciseMetric[];
  variantName: string;
}> = [
  {
    slug: "bench-press",
    equipment: "dumbbell",
    metrics: WR,
    variantName: "Dumbbell",
  },
  {
    slug: "bench-press",
    equipment: "smith_machine",
    metrics: WR,
    variantName: "Smith Machine",
  },
  {
    slug: "bench-press",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "incline-bench-press",
    equipment: "dumbbell",
    metrics: WR,
    variantName: "Dumbbell",
  },
  {
    slug: "incline-bench-press",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "chest-fly",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "chest-fly",
    equipment: "resistance_band",
    metrics: WR,
    variantName: "Resistance Band",
  },
  {
    slug: "bicep-curls",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "bicep-curls",
    equipment: "ez_bar",
    metrics: WR,
    variantName: "EZ Bar",
  },
  {
    slug: "bent-over-row",
    equipment: "dumbbell",
    metrics: WR,
    variantName: "Dumbbell",
  },
  {
    slug: "shoulder-press",
    equipment: "dumbbell",
    metrics: WR,
    variantName: "Dumbbell",
  },
  {
    slug: "shoulder-press",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "shoulder-press",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "squats",
    equipment: "smith_machine",
    metrics: WR,
    variantName: "Smith Machine",
  },
  {
    slug: "skull-crushers",
    equipment: "ez_bar",
    metrics: WR,
    variantName: "EZ Bar",
  },
  {
    slug: "lateral-raises",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "lateral-raises",
    equipment: "resistance_band",
    metrics: R,
    variantName: "Resistance Band",
  },
  {
    slug: "face-pulls",
    equipment: "resistance_band",
    metrics: R,
    variantName: "Resistance Band",
  },
  {
    slug: "rear-delt-fly",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "rear-delt-fly",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "overhead-tricep-extension",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "upright-row",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "shrugs",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "hip-thrusts",
    equipment: "machine",
    metrics: WR,
    variantName: "Machine",
  },
  {
    slug: "crunches",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "russian-twists",
    equipment: "cable",
    metrics: WR,
    variantName: "Cable",
  },
  {
    slug: "leg-raises",
    equipment: "machine",
    metrics: R,
    variantName: "Machine",
  },
  {
    slug: "hanging-leg-raises",
    equipment: "machine",
    metrics: R,
    variantName: "Machine",
  },
];

const equipmentLabel: Record<Equipment, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  machine: "Machine",
  cable: "Cable",
  smith_machine: "Smith Machine",
  ez_bar: "EZ Bar",
  kettlebell: "Kettlebell",
  resistance_band: "Resistance Band",
  body_weight: "Bodyweight",
  other: "Other",
};

type VariantRecord = ExerciseVariant & { exerciseId: string };

const defaultVariants: VariantRecord[] = PREDEFINED.map((row) => ({
  _id: variantId(row.slug, row.equipment),
  exerciseId: exerciseId(row.slug),
  name: row.variantName ?? equipmentLabel[row.equipment],
  equipment: row.equipment,
  metrics: row.metrics,
}));

const additionalVariants: VariantRecord[] = extraVariants.map((row) => ({
  _id: variantId(row.slug, row.equipment),
  exerciseId: exerciseId(row.slug),
  name: row.variantName,
  equipment: row.equipment,
  metrics: row.metrics,
}));

const allVariants: VariantRecord[] = [
  ...defaultVariants,
  ...additionalVariants,
];

export const mockExercises: Exercise[] = PREDEFINED.map((row) => {
  const id = exerciseId(row.slug);
  return {
    _id: id,
    createdAt: seededAt,
    updatedAt: seededAt,
    name: row.name,
    category: row.category,
    primaryMuscleGroup: row.primary,
    secondaryMuscleGroups: row.secondary,
    isCustom: false,
    variants: allVariants
      .filter((variant) => variant.exerciseId === id)
      .map((variant) => ({
        _id: variant._id,
        name: variant.name,
        equipment: variant.equipment,
        metrics: variant.metrics,
      })),
  };
});

export const mockExerciseBySlug = Object.fromEntries(
  PREDEFINED.map((row) => [row.slug, row]),
) as Record<string, SeedRow>;

export const getWorkoutExerciseSnapshot = (
  slug: string,
  equipment: Equipment,
): Omit<WorkoutExercise, "sets"> => {
  const row = mockExerciseBySlug[slug];
  const variant = allVariants.find(
    (item) =>
      item.exerciseId === exerciseId(slug) && item.equipment === equipment,
  );

  if (!row || !variant) {
    throw new Error(`Unknown catalog line: ${slug} / ${equipment}`);
  }

  return {
    exerciseId: exerciseId(slug),
    variantId: variant._id,
    name: row.name,
    category: row.category,
    primaryMuscleGroup: row.primary,
    secondaryMuscleGroups: row.secondary,
    equipment,
    metrics: variant.metrics,
  };
};
