import { ExerciseMetric, MetricSetValues } from "../types/exercise";

/** At least one of reps, weight, or duration must be selected. */
export const hasAtLeastOneMetric = (metrics: ExerciseMetric[]): boolean =>
  metrics.length > 0;

/**
 * Volume applies only when weight is tracked.
 * With reps: volume = weight × reps. Weight-only: volume = weight.
 * Duration never contributes to volume.
 */
export const canCalculateSetVolume = (metrics: ExerciseMetric[]): boolean =>
  metrics.includes("weight");

export const getSetVolume = (
  set: MetricSetValues,
  metrics: ExerciseMetric[],
): number => {
  if (!canCalculateSetVolume(metrics)) return 0;

  const weight = set.weight ?? 0;
  if (metrics.includes("reps")) {
    return weight * (set.reps ?? 0);
  }
  return weight;
};
