import { MultiSelectOption } from "@/components/ui/MultiSelect";
import { SelectOption } from "@/components/ui/SelectBox";
import type { ExerciseFormData } from "@/components/exercise/ExerciseFormContent";
import type {
  Equipment,
  Exercise,
  ExerciseCategory,
  ExerciseMetric,
  ExerciseSet,
  ExerciseVariant,
  MuscleGroup,
  SetType,
  Workout,
  WorkoutExercise,
} from "@/types/entities";
import {
  ALL_EQUIPMENT,
  ALL_EXERCISE_METRICS,
  EXERCISE_CATEGORY_ORDER,
  MUSCLES_BY_CATEGORY,
  formatCategory,
  formatEquipment,
  formatMuscleGroup,
  getExerciseVolume,
} from "@/utils/workoutUtils";

export type ExercisePerformance = {
  workout: Workout;
  lines: WorkoutExercise[];
};

export type ExerciseWrite = Omit<Exercise, "_id" | "createdAt" | "updatedAt">;

export const createEmptyVariant = (): ExerciseVariant => ({
  _id: `temp-${crypto.randomUUID()}`,
  name: formatEquipment("barbell"),
  equipment: "barbell",
  metrics: ["weight", "reps"],
});

export const createEmptyExerciseFormData = (): ExerciseFormData => ({
  name: "",
  category: "",
  primaryMuscleGroup: "",
  secondaryMuscleGroups: [],
  variants: [createEmptyVariant()],
});

export const getExerciseFormData = (exercise: Exercise): ExerciseFormData => ({
  name: exercise.name,
  category: exercise.category,
  primaryMuscleGroup: exercise.primaryMuscleGroup,
  secondaryMuscleGroups: [...(exercise.secondaryMuscleGroups ?? [])],
  variants: exercise.variants.map((variant) => ({
    ...variant,
    metrics: [...variant.metrics],
  })),
});

export const getEquipmentOptions = (): SelectOption[] =>
  ALL_EQUIPMENT.map((equipment) => ({
    value: equipment,
    label: formatEquipment(equipment),
  }));

export const getMetricOptions = (): MultiSelectOption[] =>
  ALL_EXERCISE_METRICS.map((metric) => ({
    value: metric,
    label:
      metric === "weight" ? "Weight" : metric === "reps" ? "Reps" : "Duration",
  }));

export const defaultMetricsForEquipment = (
  equipment: Equipment,
): ExerciseMetric[] => {
  if (equipment === "body_weight") return ["reps"];
  return ["weight", "reps"];
};

export const isValidVariant = (variant: ExerciseVariant): boolean =>
  Boolean(variant.equipment && variant.metrics.length > 0);

export const hasUniqueVariantEquipment = (
  variants: ExerciseVariant[],
): boolean =>
  new Set(variants.map((variant) => variant.equipment)).size ===
  variants.length;

export const isExerciseFormValid = (formData: ExerciseFormData): boolean =>
  formData.name.trim().length > 0 &&
  formData.category !== "" &&
  formData.primaryMuscleGroup !== "" &&
  formData.variants.length > 0 &&
  formData.variants.every(isValidVariant) &&
  hasUniqueVariantEquipment(formData.variants);

const normalizeVariantForWrite = (
  variant: ExerciseVariant,
  exerciseName: string,
): ExerciseVariant => ({
  _id: variant._id.startsWith("temp-")
    ? `var-${slugify(exerciseName)}-${variant.equipment}`
    : variant._id,
  name: variant.name.trim() || formatEquipment(variant.equipment),
  equipment: variant.equipment,
  metrics: variant.metrics,
});

export const getCategoryOptions = (): SelectOption[] =>
  EXERCISE_CATEGORY_ORDER.map((category) => ({
    value: category,
    label: formatCategory(category),
  }));

export const getMuscleSelectOptions = (
  category: ExerciseCategory | "",
): SelectOption[] => {
  if (!category) return [];

  return MUSCLES_BY_CATEGORY[category].map((muscle) => ({
    value: muscle,
    label: formatMuscleGroup(muscle),
  }));
};

export const getGroupedMuscleOptions = (): MultiSelectOption[] =>
  EXERCISE_CATEGORY_ORDER.flatMap((category) =>
    MUSCLES_BY_CATEGORY[category].map((muscle) => ({
      value: muscle,
      label: formatMuscleGroup(muscle),
      group: formatCategory(category),
    })),
  );

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "custom";

export const buildExerciseWritePayload = (
  formData: ExerciseFormData,
  options: {
    userId?: string;
    isCustom?: boolean;
  } = {},
): ExerciseWrite => ({
  name: formData.name.trim(),
  category: formData.category as ExerciseCategory,
  primaryMuscleGroup: formData.primaryMuscleGroup as MuscleGroup,
  secondaryMuscleGroups:
    formData.secondaryMuscleGroups.length > 0
      ? formData.secondaryMuscleGroups
      : undefined,
  isCustom: options.isCustom ?? true,
  userId: options.userId,
  variants: formData.variants.map((variant) =>
    normalizeVariantForWrite(variant, formData.name),
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

export const SET_TYPE_LABELS: Record<SetType, string> = {
  warmup: "W",
  drop: "D",
  failure: "F",
  regular: "R",
};

export const getSetTypeLabel = (
  sets: { type: SetType }[],
  index: number,
): string => {
  const type = sets[index]?.type ?? "regular";
  if (type !== "regular") {
    return SET_TYPE_LABELS[type];
  }

  return String(
    sets.slice(0, index + 1).filter((set) => set.type === "regular").length,
  );
};

export const getSetTypeThemeClass = (type: SetType = "regular"): string => {
  switch (type) {
    case "warmup":
      return "text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-800";
    case "drop":
      return "text-yellow-700 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-800";
    case "failure":
      return "text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-800";
    default:
      return "text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800";
  }
};
