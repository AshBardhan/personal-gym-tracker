import type mongoose from "mongoose";
import type { ISet } from "@/models/Set.js";
import type { IWorkout, IWorkoutExercise } from "@/models/Workout.js";
import type { SetType } from "@/types/exercise.js";

/** Blueprint set — structure only; no logged reps or duration. */
export interface BlueprintSet {
  type: SetType;
  weight?: number;
}

/** Blueprint exercise — catalog snapshot without subdocument ids. */
export interface BlueprintExercise {
  exerciseId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  name: string;
  category: IWorkoutExercise["category"];
  primaryMuscleGroup: IWorkoutExercise["primaryMuscleGroup"];
  secondaryMuscleGroups?: IWorkoutExercise["secondaryMuscleGroups"];
  equipment: IWorkoutExercise["equipment"];
  metrics: IWorkoutExercise["metrics"];
  sets: BlueprintSet[];
}

/** Reusable workout structure for clone and future template instantiation. */
export interface WorkoutStructure {
  exercises: BlueprintExercise[];
}

/** Fields for a new Workout document cloned from an existing session. */
export type WorkoutClonePayload = Pick<
  IWorkout,
  "userId" | "title" | "date" | "exercises"
>;

const extractBlueprintSet = (set: ISet): BlueprintSet => {
  const blueprint: BlueprintSet = { type: set.type };
  if ((set.weight ?? 0) > 0) {
    blueprint.weight = set.weight;
  }
  return blueprint;
};

/**
 * Extract reusable structure from a logged workout.
 * Omits session fields (date, memo) and performance data (reps, duration).
 */
export const extractStructureFromWorkout = (
  source: Pick<IWorkout, "exercises">,
): WorkoutStructure => ({
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
    sets: exercise.sets.map(extractBlueprintSet),
  })),
});

/** Build a create payload for a new workout session from a blueprint. */
export const structureToNewWorkoutPayload = (
  structure: WorkoutStructure,
  options: {
    userId: mongoose.Types.ObjectId;
    title: string;
    date: Date;
  },
): WorkoutClonePayload => ({
  userId: options.userId,
  title: options.title,
  date: options.date,
  exercises: structure.exercises.map((exercise) => ({
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
    sets: exercise.sets.map((set) => ({ ...set })),
  })),
});

/**
 * Build payload for cloning a workout into a new session.
 * Copies title and exercise structure; sets date to now; omits memo and logged reps/duration.
 */
export const buildWorkoutClonePayload = (
  source: IWorkout,
): WorkoutClonePayload =>
  structureToNewWorkoutPayload(extractStructureFromWorkout(source), {
    userId: source.userId,
    title: source.title,
    date: new Date(),
  });
