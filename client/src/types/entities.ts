/**
 * Client API shapes. Workout payloads are self-contained;
 * catalog is only for exercise list/page and the workout picker.
 */

export type ExerciseCategory =
  | "chest"
  | "shoulders"
  | "arms"
  | "back"
  | "legs"
  | "core"
  | "cardio"
  | "full_body";

export type MuscleGroup =
  | "chest"
  | "upper_chest"
  | "lower_chest"
  | "front_delts"
  | "side_delts"
  | "rear_delts"
  | "triceps"
  | "biceps"
  | "forearms"
  | "lats"
  | "traps"
  | "upper_back"
  | "lower_back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"
  | "abs"
  | "obliques"
  | "hip_flexors";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "cable"
  | "smith_machine"
  | "ez_bar"
  | "kettlebell"
  | "resistance_band"
  | "body_weight"
  | "other";

export type ExerciseMetric = "reps" | "weight" | "duration";

export type SetType = "regular" | "warmup" | "drop" | "failure";

export interface User {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

/** Catalog row — exercise list, exercise page, create/edit workout picker. */
export interface Exercise {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  isCustom: boolean;
  userId?: string;
  variants: ExerciseVariant[];
}

export interface ExerciseVariant {
  _id: string;
  name: string;
  equipment: Equipment;
  metrics: ExerciseMetric[];
}

/** Session — workout list and workout page. One GET, no catalog join. */
export interface Workout {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  title: string;
  date: string;
  memo?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  _id?: string;
  /** Catalog id — exercise page history filters workouts by this. */
  exerciseId: string;
  variantId: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  equipment: Equipment;
  metrics: ExerciseMetric[];
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  _id?: string;
  type: SetType;
  reps?: number;
  weight?: number;
  duration?: number;
}
