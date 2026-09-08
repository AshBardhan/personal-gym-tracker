import { Workout } from "@/types/entities";
import {
  getTotalSets,
  getTotalVolume,
  hasWorkoutWeightedVolume,
} from "@/utils/workoutUtils";

export interface DashboardStats {
  sessions: number;
  uniqueExercises: number;
  totalSets: number;
  totalVolume: number;
  hasWeightedVolume: boolean;
}

export const getDashboardStats = (workouts: Workout[]): DashboardStats => {
  const exerciseIds = new Set<string>();
  let totalSets = 0;
  let totalVolume = 0;
  let hasWeightedVolume = false;

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId) {
        exerciseIds.add(exercise.exerciseId);
      }
    }

    totalSets += getTotalSets(workout);
    totalVolume += getTotalVolume(workout);

    if (hasWorkoutWeightedVolume(workout)) {
      hasWeightedVolume = true;
    }
  }

  return {
    sessions: workouts.length,
    uniqueExercises: exerciseIds.size,
    totalSets,
    totalVolume,
    hasWeightedVolume,
  };
};
