import { Exercise, Workout, Set } from "../types/workout";
import { PREDEFINED_EXERCISES, PredefinedExercise } from "../constants/exercises";
import { SelectOption } from "../components/ui/SelectBox";

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
      exercise.sets.some((set) => set.reps > 0 || set.weight > 0)
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
 * Calculate volume for a single set (reps × weight)
 */
export const getSetVolume = (set: Set): number => {
  return set.reps * set.weight;
};

/**
 * Calculate total volume for an exercise (sum of all sets)
 */
export const getExerciseVolume = (sets: Set[]): number => {
  return sets.reduce((total, set) => total + getSetVolume(set), 0);
};

/**
 * Get total number of sets in a workout
 */
export const getTotalSets = (workout: Workout): number => {
  return workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );
};

/**
 * Calculate total volume for entire workout
 */
export const getTotalVolume = (workout: Workout): number => {
  return workout.exercises.reduce(
    (total, exercise) => total + getExerciseVolume(exercise.sets),
    0
  );
};

// ============================================================
// EXERCISE UTILITIES
// ============================================================

/**
 * Get exercises filtered by category
 */
export const getExercisesByCategory = (
  category: string
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
        muscle.toLowerCase().includes(lowerQuery)
      )
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
  return `${Math.round(volume)} kg`;
};
