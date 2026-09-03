import { Exercise } from "@/types/workout";
import {
  Equipment,
  ExerciseCategory,
  ExerciseMetric,
  MuscleGroup,
  SetType,
} from "@/types/entities";
import {
  PREDEFINED_EXERCISES,
  PredefinedExercise,
} from "@/constants/exercises";
import { SelectOption } from "@/components/ui/SelectBox";

type LoadSet = {
  reps?: number;
  weight?: number;
};

type VolumeWorkout = {
  exercises: { sets: LoadSet[] }[];
};

/**
 * Workout Utilities
 * Consolidated utilities for workout data, calculations, validation, and formatting
 */

// ============================================================
// VALIDATION UTILITIES
// ============================================================

/**
 * Check if an exercise is valid (has name and at least one set with data)
 */
export const isValidExercise = (exercise: Exercise): boolean => {
  return Boolean(
    exercise.name.trim() &&
      exercise.sets.length > 0 &&
      exercise.sets.some((set) => set.reps > 0 || set.weight > 0),
  );
};

/**
 * Check if there is at least one valid exercise in the array
 */
export const hasValidExercises = (exercises: Exercise[]): boolean => {
  const validExercises = exercises.filter(isValidExercise);
  return validExercises.length > 0;
};

/**
 * Filter and return only valid exercises
 */
export const getValidExercises = (exercises: Exercise[]): Exercise[] => {
  return exercises.filter(isValidExercise);
};

// ============================================================
// CALCULATION UTILITIES
// ============================================================

/**
 * Calculate volume for a single set (reps × weight).
 * Timed / reps-only sets contribute 0, not NaN.
 */
export const getSetVolume = (set: LoadSet): number => {
  return (set.reps ?? 0) * (set.weight ?? 0);
};

/**
 * Calculate total volume for an exercise (sum of all sets)
 */
export const getExerciseVolume = (sets: LoadSet[]): number => {
  return sets.reduce((total, set) => total + getSetVolume(set), 0);
};

/**
 * Get total number of sets in a workout
 */
export const getTotalSets = (workout: VolumeWorkout): number => {
  return workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );
};

/**
 * Calculate total volume for entire workout
 */
export const getTotalVolume = (workout: VolumeWorkout): number => {
  return workout.exercises.reduce(
    (total, exercise) => total + getExerciseVolume(exercise.sets),
    0,
  );
};

/**
 * Get total number of reps in a workout
 */
export const getTotalReps = (workout: VolumeWorkout): number => {
  return workout.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce((setTotal, set) => setTotal + (set.reps ?? 0), 0),
    0,
  );
};

export interface DistributionItem {
  label: string;
  percent: number;
}

const toDistribution = (totals: Record<string, number>): DistributionItem[] => {
  const grandTotal = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (grandTotal === 0) return [];

  return Object.entries(totals)
    .map(([label, value]) => ({
      label,
      percent: Math.round((value / grandTotal) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
};

/**
 * Category distribution: logged lines per category
 */
export const getCategoryDistribution = (workout: {
  exercises: { category?: string }[];
}): DistributionItem[] => {
  const totals: Record<string, number> = {};

  for (const exercise of workout.exercises) {
    const category = formatCategory(exercise.category?.trim() || "other");
    totals[category] = (totals[category] || 0) + 1;
  }

  return toDistribution(totals);
};

/**
 * Muscle distribution: each logged line counts toward primary + secondary
 */
export const getMuscleGroupDistribution = (workout: {
  exercises: {
    muscleGroup?: string[];
    primaryMuscleGroup?: string;
    secondaryMuscleGroups?: string[];
  }[];
}): DistributionItem[] => {
  const totals: Record<string, number> = {};

  for (const exercise of workout.exercises) {
    const groups = (
      exercise.muscleGroup ?? [
        exercise.primaryMuscleGroup,
        ...(exercise.secondaryMuscleGroups ?? []),
      ]
    )
      .map((group) => group?.trim())
      .filter((group): group is string => Boolean(group));

    if (groups.length === 0) {
      totals.Other = (totals.Other || 0) + 1;
      continue;
    }

    for (const group of groups) {
      const label = formatMuscleGroup(group);
      totals[label] = (totals[label] || 0) + 1;
    }
  }

  return toDistribution(totals);
};

/**
 * Equipment distribution: logged lines per equipment
 */
export const getEquipmentDistribution = (workout: {
  exercises: { equipment?: Equipment }[];
}): DistributionItem[] => {
  const totals: Record<string, number> = {};

  for (const exercise of workout.exercises) {
    const label = exercise.equipment
      ? formatEquipment(exercise.equipment)
      : "Other";
    totals[label] = (totals[label] || 0) + 1;
  }

  return toDistribution(totals);
};

// ============================================================
// EXERCISE UTILITIES
// ============================================================

/**
 * Get exercises filtered by category
 */
export const getExercisesByCategory = (
  category: string,
): PredefinedExercise[] => {
  return PREDEFINED_EXERCISES.filter((ex) => ex.category === category);
};

/**
 * Search exercises by name, category, or muscle group
 */
export const searchExercises = (query: string): PredefinedExercise[] => {
  const lowerQuery = query.toLowerCase();
  return PREDEFINED_EXERCISES.filter(
    (ex) =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.category.toLowerCase().includes(lowerQuery) ||
      ex.muscleGroup.some((muscle) =>
        muscle.toLowerCase().includes(lowerQuery),
      ),
  );
};

/**
 * Get all exercise names sorted alphabetically
 */
export const getAllExerciseNames = (): string[] => {
  return PREDEFINED_EXERCISES.map((ex) => ex.name).sort();
};

/**
 * Convert exercises to SelectBox options format
 */
export const getExerciseOptions = (): SelectOption[] => {
  return PREDEFINED_EXERCISES.map((exercise) => ({
    value: exercise.name,
    label: exercise.name,
    searchTerms: [exercise.category, ...exercise.muscleGroup],
  }));
};

// ============================================================
// FORMATTING UTILITIES
// ============================================================

/**
 * Format date for workout list display
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date with weekday for workout detail display
 */
export const formatDetailDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format weight with unit
 */
export const formatWeight = (weight: number): string => {
  return `${weight} kg`;
};

/**
 * Format volume (rounded) with unit
 */
export const formatVolume = (volume: number): string => {
  const amount = Number.isFinite(volume) ? Math.round(volume) : 0;
  return `${amount} kg`;
};

export const EXERCISE_CATEGORY_ORDER: ExerciseCategory[] = [
  "chest",
  "shoulders",
  "arms",
  "back",
  "legs",
  "core",
  "cardio",
  "full_body",
];

/** Muscles listed under each category in the exercise filter dropdown. */
export const MUSCLES_BY_CATEGORY: Record<ExerciseCategory, MuscleGroup[]> = {
  chest: ["chest", "upper_chest", "lower_chest"],
  shoulders: ["front_delts", "side_delts", "rear_delts"],
  arms: ["biceps", "triceps", "forearms"],
  back: ["lats", "traps", "upper_back", "lower_back"],
  legs: ["glutes", "quads", "hamstrings", "calves"],
  core: ["abs", "obliques", "hip_flexors"],
  cardio: [],
  full_body: [],
};

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  chest: "Chest",
  shoulders: "Shoulders",
  arms: "Arms",
  back: "Back",
  legs: "Legs",
  core: "Core",
  cardio: "Cardio",
  full_body: "Full Body",
};

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  upper_chest: "Upper Chest",
  lower_chest: "Lower Chest",
  front_delts: "Front Delts",
  side_delts: "Side Delts",
  rear_delts: "Rear Delts",
  triceps: "Triceps",
  biceps: "Biceps",
  forearms: "Forearms",
  lats: "Lats",
  traps: "Traps",
  upper_back: "Upper Back",
  lower_back: "Lower Back",
  glutes: "Glutes",
  quads: "Quads",
  hamstrings: "Hamstrings",
  calves: "Calves",
  abs: "Abs",
  obliques: "Obliques",
  hip_flexors: "Hip Flexors",
};

const EQUIPMENT_LABELS: Record<Equipment, string> = {
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

const formatSlugFallback = (slug: string): string =>
  slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatCategory = (category: string): string =>
  CATEGORY_LABELS[category as ExerciseCategory] ?? formatSlugFallback(category);

export const formatMuscleGroup = (muscle: string): string =>
  MUSCLE_GROUP_LABELS[muscle as MuscleGroup] ?? formatSlugFallback(muscle);

export const formatEquipment = (equipment: Equipment): string =>
  EQUIPMENT_LABELS[equipment];

/** Weighted load + 1RM only when the variant tracks external load. */
export const hasWeightedStats = (exercise: {
  equipment: Equipment;
  metrics: ExerciseMetric[];
}): boolean =>
  exercise.equipment !== "body_weight" && exercise.metrics.includes("weight");

export const hasWorkoutWeightedVolume = (workout: {
  exercises: { equipment: Equipment; metrics: ExerciseMetric[] }[];
}): boolean => workout.exercises.some(hasWeightedStats);

export const formatExerciseMetrics = (metrics: ExerciseMetric[]): string => {
  const labels: Record<ExerciseMetric, string> = {
    weight: "Weight",
    reps: "Reps",
    duration: "Duration",
  };
  return metrics.map((metric) => labels[metric]).join(" × ");
};

export const formatSetDuration = (durationSec: number): string =>
  `${durationSec}s`;

const SET_TYPE_BADGE: Record<Exclude<SetType, "regular">, string> = {
  warmup: "W",
  drop: "D",
  failure: "F",
};

/** Warmup/drop/failure keep a letter; working sets are numbered 1, 2, 3… */
export const getSetSequenceLabel = (
  sets: { type: SetType }[],
  index: number,
): string => {
  const type = sets[index]?.type ?? "regular";
  if (type !== "regular") {
    return SET_TYPE_BADGE[type];
  }

  return String(
    sets.slice(0, index + 1).filter((set) => set.type === "regular").length,
  );
};
