import type { ExerciseFormValues } from "@/components/exercise/ExerciseFormContent";
import type {
  Exercise,
  ExerciseSet,
  Workout,
  WorkoutExercise,
} from "@/types/entities";
import {
  formatCategory,
  formatMuscleGroup,
  getExerciseVolume,
} from "@/utils/workoutUtils";

export type ExercisePerformance = {
  workout: Workout;
  lines: WorkoutExercise[];
};

export const exerciseToFormValues = (
  exercise: Exercise,
): ExerciseFormValues => ({
  name: exercise.name,
  category: formatCategory(exercise.category),
  primaryMuscle: formatMuscleGroup(exercise.primaryMuscleGroup),
  secondaryMuscles: (exercise.secondaryMuscleGroups ?? []).map(
    formatMuscleGroup,
  ),
});

export const getWorkoutsForExercise = (
  workouts: Workout[],
  exerciseId: string,
): ExercisePerformance[] => {
  if (!exerciseId) return [];

  return workouts
    .map((workout) => {
      const lines = workout.exercises.filter(
        (item) => item.exerciseId === exerciseId,
      );
      if (lines.length === 0) return null;

      return { workout, lines };
    })
    .filter((item): item is ExercisePerformance => item !== null)
    .sort(
      (a, b) =>
        new Date(b.workout.date).getTime() - new Date(a.workout.date).getTime(),
    );
};

export const estimateOneRepMax = (weight: number, reps: number): number => {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

const performanceSets = (item: ExercisePerformance): ExerciseSet[] =>
  item.lines.flatMap((line) => line.sets);

export const getExerciseStats = (performances: ExercisePerformance[]) => {
  const uniqueDays = new Set(
    performances.map((item) =>
      new Date(item.workout.date).toISOString().slice(0, 10),
    ),
  );

  const totalSets = performances.reduce(
    (total, item) => total + performanceSets(item).length,
    0,
  );
  const totalReps = performances.reduce(
    (total, item) =>
      total +
      performanceSets(item).reduce((sum, set) => sum + (set.reps ?? 0), 0),
    0,
  );
  const totalVolume = performances.reduce(
    (total, item) =>
      total +
      item.lines.reduce(
        (lineTotal, line) => lineTotal + getExerciseVolume(line.sets),
        0,
      ),
    0,
  );
  const maxVolume = performances.reduce(
    (best, item) =>
      Math.max(
        best,
        item.lines.reduce(
          (lineBest, line) => Math.max(lineBest, getExerciseVolume(line.sets)),
          0,
        ),
      ),
    0,
  );
  const maxWeight = performances.reduce(
    (best, item) =>
      Math.max(
        best,
        performanceSets(item).reduce(
          (setBest, set) => Math.max(setBest, set.weight ?? 0),
          0,
        ),
      ),
    0,
  );

  const bestOneRepMax = performances.reduce((best, item) => {
    const sessionBest = performanceSets(item).reduce(
      (setBest, set) =>
        Math.max(setBest, estimateOneRepMax(set.weight ?? 0, set.reps ?? 0)),
      0,
    );
    return Math.max(best, sessionBest);
  }, 0);

  const days = uniqueDays.size;

  return {
    days,
    totalSets,
    totalReps,
    totalVolume,
    maxVolume,
    averageVolume: days > 0 ? totalVolume / days : 0,
    maxWeight,
    bestOneRepMax,
  };
};
