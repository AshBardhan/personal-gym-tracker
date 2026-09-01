import { CatalogExercise } from "@/constants/exercises";
import type { ExerciseFormValues } from "@/components/exercise/ExerciseFormContent";
import type { Set, Workout } from "@/types/workout";
import { getExerciseVolume } from "@/utils/workoutUtils";

export type ExercisePerformance = {
  workout: Workout;
  sets: Set[];
  volume: number;
};

export const catalogExerciseToFormValues = (
  exercise: CatalogExercise,
): ExerciseFormValues => {
  const [primaryMuscle = "", ...secondaryMuscles] = exercise.muscleGroup;
  return {
    name: exercise.name,
    category: exercise.category,
    primaryMuscle,
    secondaryMuscles,
  };
};

export const getWorkoutsForExercise = (
  workouts: Workout[],
  exerciseName: string,
): ExercisePerformance[] => {
  const name = exerciseName.trim().toLowerCase();
  if (!name) return [];

  return workouts
    .map((workout) => {
      const matches = workout.exercises.filter(
        (exercise) => exercise.name.trim().toLowerCase() === name,
      );
      if (matches.length === 0) return null;

      const sets = matches.flatMap((exercise) => exercise.sets);
      return {
        workout,
        sets,
        volume: getExerciseVolume(sets),
      };
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

export const getExerciseStats = (performances: ExercisePerformance[]) => {
  const uniqueDays = new Set(
    performances.map((item) =>
      new Date(item.workout.date).toISOString().slice(0, 10),
    ),
  );

  const totalSets = performances.reduce(
    (total, item) => total + item.sets.length,
    0,
  );
  const totalVolume = performances.reduce(
    (total, item) => total + item.volume,
    0,
  );
  const bestVolume = performances.reduce(
    (best, item) => Math.max(best, item.volume),
    0,
  );
  const bestOneRepMax = performances.reduce((best, item) => {
    const sessionBest = item.sets.reduce(
      (setBest, set) =>
        Math.max(setBest, estimateOneRepMax(set.weight, set.reps)),
      0,
    );
    return Math.max(best, sessionBest);
  }, 0);

  return {
    days: uniqueDays.size,
    totalSets,
    totalVolume,
    bestVolume,
    bestOneRepMax,
  };
};
