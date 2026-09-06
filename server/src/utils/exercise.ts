import type { IExercise } from "@/models/Exercise.js";
import { ExerciseMetric, MetricSetValues } from "@/types/exercise.js";

/** Fields for a new Exercise document cloned from an existing one. */
export type ExerciseClonePayload = Pick<
  IExercise,
  | "name"
  | "category"
  | "primaryMuscleGroup"
  | "secondaryMuscleGroups"
  | "isCustom"
  | "userId"
  | "variants"
>;

/**
 * Build payload for cloning an exercise.
 * Omits _id/timestamps; variant subdocument ids are omitted so MongoDB assigns new ones.
 * isCustom follows source ownership: catalog exercises (no userId) stay non-custom until auth.
 */
export const buildExerciseClonePayload = (
  source: IExercise,
): ExerciseClonePayload => ({
  name: `${source.name} (cloned)`,
  category: source.category,
  primaryMuscleGroup: source.primaryMuscleGroup,
  secondaryMuscleGroups: source.secondaryMuscleGroups ?? [],
  isCustom: Boolean(source.userId),
  userId: source.userId,
  variants: source.variants.map((variant) => ({
    name: variant.name,
    equipment: variant.equipment,
    metrics: [...variant.metrics],
  })),
});

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
