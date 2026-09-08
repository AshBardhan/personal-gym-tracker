import {
  Equipment,
  Exercise,
  ExerciseCategory,
  ExerciseMetric,
  ExerciseSet,
  ExerciseVariant,
  MuscleGroup,
  Workout,
  WorkoutExercise,
} from "@/types/entities";
import { SelectOption } from "@/components/ui/SelectBox";
import { WorkoutWrite } from "@/types/entities";

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

export const createEmptySet = (): ExerciseSet => ({ type: "regular" });

export const createEmptyWorkoutExercise = (): WorkoutExercise => ({
  exerciseId: "",
  variantId: "",
  name: "",
  category: "full_body",
  primaryMuscleGroup: "abs",
  equipment: "other",
  metrics: ["weight", "reps"],
  sets: [createEmptySet()],
});

export const pruneSetToMetrics = (
  set: ExerciseSet,
  metrics: ExerciseMetric[],
): ExerciseSet => {
  const next: ExerciseSet = { type: set.type };
  if (set._id) next._id = set._id;
  if (metrics.includes("reps")) next.reps = set.reps;
  if (metrics.includes("weight")) next.weight = set.weight;
  if (metrics.includes("duration")) next.duration = set.duration;
  return next;
};

export const snapshotWorkoutExercise = (
  catalog: Exercise,
  variant: ExerciseVariant,
  previous?: WorkoutExercise,
): WorkoutExercise => ({
  _id: previous?._id,
  exerciseId: catalog._id,
  variantId: variant._id,
  name: catalog.name,
  category: catalog.category,
  primaryMuscleGroup: catalog.primaryMuscleGroup,
  secondaryMuscleGroups: catalog.secondaryMuscleGroups
    ? [...catalog.secondaryMuscleGroups]
    : undefined,
  equipment: variant.equipment,
  metrics: variant.metrics,
  sets: (previous?.sets.length ? previous.sets : [createEmptySet()]).map(
    (set) => pruneSetToMetrics(set, variant.metrics),
  ),
});

export const isValidSetForMetrics = (
  set: ExerciseSet,
  metrics: ExerciseMetric[],
): boolean => metrics.every((metric) => (set[metric] ?? 0) > 0);

export const serializeWorkoutSet = (
  set: ExerciseSet,
  metrics: ExerciseMetric[],
): ExerciseSet => {
  const next: ExerciseSet = { type: set.type };
  if (set._id) next._id = set._id;
  if (metrics.includes("reps") && (set.reps ?? 0) > 0) next.reps = set.reps;
  if (metrics.includes("weight") && (set.weight ?? 0) > 0) {
    next.weight = set.weight;
  }
  if (metrics.includes("duration") && (set.duration ?? 0) > 0) {
    next.duration = set.duration;
  }
  return next;
};

/** Catalog pick + at least one set with values for this variant's metrics. */
export const isValidWorkoutExercise = (exercise: WorkoutExercise): boolean =>
  Boolean(
    exercise.exerciseId &&
      exercise.variantId &&
      exercise.name.trim() &&
      exercise.sets.some((set) => isValidSetForMetrics(set, exercise.metrics)),
  );

export const getValidWorkoutExercises = (
  exercises: WorkoutExercise[],
): WorkoutExercise[] =>
  exercises.filter(isValidWorkoutExercise).map((exercise) => ({
    ...exercise,
    sets: exercise.sets
      .filter((set) => isValidSetForMetrics(set, exercise.metrics))
      .map((set) => serializeWorkoutSet(set, exercise.metrics)),
  }));

export const setHasMetricValues = (
  set: ExerciseSet,
  metrics: ExerciseMetric[],
): boolean => metrics.some((metric) => (set[metric] ?? 0) > 0);

/** Selected exercise with at least one set missing required metric values. */
export const exerciseHasIncompleteSets = (exercise: WorkoutExercise): boolean =>
  Boolean(exercise.exerciseId) &&
  exercise.sets.some((set) => !isValidSetForMetrics(set, exercise.metrics));

export const countIncompleteSets = (exercises: WorkoutExercise[]): number =>
  exercises.reduce(
    (total, exercise) =>
      exercise.exerciseId
        ? total +
          exercise.sets.filter(
            (set) => !isValidSetForMetrics(set, exercise.metrics),
          ).length
        : total,
    0,
  );

/** True when save would drop incomplete sets or exercises without valid sets. */
export const wouldPruneWorkoutForm = (exercises: WorkoutExercise[]): boolean =>
  countIncompleteSets(exercises) > 0;

export const isStartedEmptyExerciseRow = (
  exercise: WorkoutExercise,
): boolean => {
  const metrics =
    exercise.metrics.length > 0 ? exercise.metrics : ["weight", "reps"];
  return (
    !exercise.exerciseId &&
    exercise.sets.some((set) =>
      setHasMetricValues(set, metrics as ExerciseMetric[]),
    )
  );
};

export const hasInvalidWorkoutFormData = (
  exercises: WorkoutExercise[],
): boolean =>
  exercises.some(isStartedEmptyExerciseRow) ||
  exercises.some(exerciseHasIncompleteSets);

/** Highlight required metric inputs on incomplete sets when validation is forced. */
export const shouldHighlightSetMetric = (
  exercise: WorkoutExercise,
  set: ExerciseSet,
  metric: ExerciseMetric,
  showErrors: boolean,
): boolean => {
  if (!showErrors || !exercise.exerciseId) return false;
  if (!exercise.metrics.includes(metric)) return false;
  if (isValidSetForMetrics(set, exercise.metrics)) return false;

  return (set[metric] ?? 0) <= 0;
};

// ============================================================
// CLONE UTILITIES (MSW)
// ============================================================

const cloneSetForWrite = (set: ExerciseSet): ExerciseSet => {
  const next: ExerciseSet = { type: set.type };
  if ((set.weight ?? 0) > 0) {
    next.weight = set.weight;
  }
  return next;
};

/** MSW-only: build create payload when cloning a workout in the mock API. */
export const buildWorkoutCloneWrite = (
  source: Workout,
  date = new Date().toISOString(),
): WorkoutWrite => ({
  userId: source.userId,
  title: source.title,
  date,
  exercises: source.exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    variantId: exercise.variantId,
    name: exercise.name,
    category: exercise.category,
    primaryMuscleGroup: exercise.primaryMuscleGroup,
    secondaryMuscleGroups: exercise.secondaryMuscleGroups
      ? [...exercise.secondaryMuscleGroups]
      : undefined,
    equipment: exercise.equipment,
    metrics: [...exercise.metrics],
    sets: exercise.sets.map(cloneSetForWrite),
  })),
});

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

type CategoryExercise = { category?: string };

type MuscleExercise = {
  muscleGroup?: string[];
  primaryMuscleGroup?: string;
  secondaryMuscleGroups?: string[];
};

type EquipmentExercise = { equipment?: Equipment };

const collectCategoryTotals = (
  exercises: CategoryExercise[],
): Record<string, number> => {
  const totals: Record<string, number> = {};

  for (const exercise of exercises) {
    const category = formatCategory(exercise.category?.trim() || "other");
    totals[category] = (totals[category] || 0) + 1;
  }

  return totals;
};

const collectMuscleTotals = (
  exercises: MuscleExercise[],
): Record<string, number> => {
  const totals: Record<string, number> = {};

  for (const exercise of exercises) {
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

  return totals;
};

const collectEquipmentTotals = (
  exercises: EquipmentExercise[],
): Record<string, number> => {
  const totals: Record<string, number> = {};

  for (const exercise of exercises) {
    const label = exercise.equipment
      ? formatEquipment(exercise.equipment)
      : "Other";
    totals[label] = (totals[label] || 0) + 1;
  }

  return totals;
};

const flattenWorkoutExercises = <T>(workouts: { exercises: T[] }[]): T[] =>
  workouts.flatMap((workout) => workout.exercises);

/**
 * Category distribution: logged lines per category
 */
export const getCategoryDistribution = (workout: {
  exercises: CategoryExercise[];
}): DistributionItem[] =>
  toDistribution(collectCategoryTotals(workout.exercises));

export const getCategoryDistributionFromWorkouts = (
  workouts: { exercises: CategoryExercise[] }[],
): DistributionItem[] =>
  toDistribution(collectCategoryTotals(flattenWorkoutExercises(workouts)));

/**
 * Muscle distribution: each logged line counts toward primary + secondary
 */
export const getMuscleGroupDistribution = (workout: {
  exercises: MuscleExercise[];
}): DistributionItem[] =>
  toDistribution(collectMuscleTotals(workout.exercises));

export const getMuscleGroupDistributionFromWorkouts = (
  workouts: { exercises: MuscleExercise[] }[],
): DistributionItem[] =>
  toDistribution(collectMuscleTotals(flattenWorkoutExercises(workouts)));

/**
 * Equipment distribution: logged lines per equipment
 */
export const getEquipmentDistribution = (workout: {
  exercises: EquipmentExercise[];
}): DistributionItem[] =>
  toDistribution(collectEquipmentTotals(workout.exercises));

export const getEquipmentDistributionFromWorkouts = (
  workouts: { exercises: EquipmentExercise[] }[],
): DistributionItem[] =>
  toDistribution(collectEquipmentTotals(flattenWorkoutExercises(workouts)));

export const getCatalogExerciseOptions = (
  exercises: Exercise[],
): SelectOption[] =>
  [...exercises]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((exercise) => ({
      value: exercise._id,
      label: exercise.name,
      searchTerms: [
        formatCategory(exercise.category),
        formatMuscleGroup(exercise.primaryMuscleGroup),
        ...(exercise.secondaryMuscleGroups ?? []).map(formatMuscleGroup),
      ],
    }));

export const getVariantOptions = (
  variants: ExerciseVariant[],
): SelectOption[] =>
  variants.map((variant) => ({
    value: variant._id,
    label: variant.name,
    searchTerms: [formatEquipment(variant.equipment)],
  }));

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

/** Per-set e1RM requires logged weight and reps on a weighted variant. */
export const canEstimateSetOneRepMax = (
  exercise: { equipment: Equipment; metrics: ExerciseMetric[] },
  set: ExerciseSet,
): boolean =>
  hasWeightedStats(exercise) &&
  exercise.metrics.includes("reps") &&
  (set.weight ?? 0) > 0 &&
  (set.reps ?? 0) > 0;

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

export const ALL_EQUIPMENT: Equipment[] = [
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
];

export const ALL_EXERCISE_METRICS: ExerciseMetric[] = [
  "weight",
  "reps",
  "duration",
];

export const formatSetDuration = (durationSec: number): string =>
  `${durationSec}s`;
