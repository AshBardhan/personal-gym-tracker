import mongoose, { Document, Schema } from "mongoose";
import { setSchema, type ISet } from "./Set.js";
import { hasAtLeastOneMetric } from "../utils/exercise.js";
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS, EQUIPMENT, EXERCISE_METRICS } from "../types/exercise.js";
import { type ExerciseCategory, type MuscleGroup, type Equipment, type ExerciseMetric } from "../types/exercise.js";

/** Denormalized exercise snapshot inside a workout session. */
export interface IWorkoutExercise {
  exerciseId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  name: string;
  category: ExerciseCategory;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  equipment: Equipment;
  metrics: ExerciseMetric[];
  sets: ISet[];
}

export const workoutExerciseSchema = new Schema<IWorkoutExercise>(
  {
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: EXERCISE_CATEGORIES,
      required: true,
    },
    primaryMuscleGroup: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: true,
    },
    secondaryMuscleGroups: {
      type: [String],
      enum: MUSCLE_GROUPS,
      default: [],
    },
    equipment: {
      type: String,
      enum: EQUIPMENT,
      required: true,
    },
    metrics: {
      type: [String],
      enum: EXERCISE_METRICS,
      required: true,
      validate: {
        validator: hasAtLeastOneMetric,
        message: "At least one metric (reps, weight, or duration) is required",
      },
    },
    sets: {
      type: [setSchema],
      default: [],
    },
  },
  { _id: true },
);

/** Session — workout list and workout page. Self-contained, no catalog join. */
export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  memo?: string;
  exercises: IWorkoutExercise[];
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    memo: {
      type: String,
      trim: true,
    },
    exercises: {
      type: [workoutExerciseSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IWorkout>("Workout", workoutSchema);
