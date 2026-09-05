export const EXERCISE_CATEGORIES = [
  "chest",
  "shoulders",
  "arms",
  "back",
  "legs",
  "core",
  "cardio",
  "full_body",
] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const MUSCLE_GROUPS = [
  "chest",
  "upper_chest",
  "lower_chest",
  "front_delts",
  "side_delts",
  "rear_delts",
  "triceps",
  "biceps",
  "forearms",
  "lats",
  "traps",
  "upper_back",
  "lower_back",
  "glutes",
  "quads",
  "hamstrings",
  "calves",
  "abs",
  "obliques",
  "hip_flexors",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EQUIPMENT = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "smith_machine",
  "ez_bar",
  "kettlebell",
  "resistance_band",
  "body_weight",
  "other",
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export const EXERCISE_METRICS = ["reps", "weight", "duration"] as const;
export type ExerciseMetric = (typeof EXERCISE_METRICS)[number];

export const SET_TYPES = ["regular", "warmup", "drop", "failure"] as const;
export type SetType = (typeof SET_TYPES)[number];

export interface MetricSetValues {
  reps?: number;
  weight?: number;
  duration?: number;
}
