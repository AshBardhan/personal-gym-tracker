import mongoose, { Document, Schema } from "mongoose";
import { hasAtLeastOneMetric } from "../utils/exercise.js";
import { type ExerciseCategory, type MuscleGroup, type Equipment, type ExerciseMetric } from "../types/exercise.js";
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS, EQUIPMENT, EXERCISE_METRICS } from "../types/exercise.js";

/** Embedded variant — equipment + metrics for a catalog exercise. */
export interface IExerciseVariant {
  name: string;
  equipment: Equipment;
  metrics: ExerciseMetric[];
}

export const exerciseVariantSchema = new Schema<IExerciseVariant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  { _id: true },
);

/** Catalog row — exercise list, exercise page, workout picker. */
export interface IExercise extends Document {
  name: string;
  category: ExerciseCategory;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups?: MuscleGroup[];
  isCustom: boolean;
  userId?: mongoose.Types.ObjectId;
  variants: IExerciseVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>(
  {
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
    isCustom: {
      type: Boolean,
      required: true,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    variants: {
      type: [exerciseVariantSchema],
      required: true,
      validate: {
        validator: (variants: IExerciseVariant[]) => variants.length > 0,
        message: "At least one variant is required",
      },
    },
  },
  { timestamps: true },
);

exerciseSchema.pre("validate", function (next) {
  if (this.isCustom && !this.userId) {
    this.invalidate("userId", "userId is required for custom exercises");
  }
  if (!this.isCustom && this.userId) {
    this.invalidate("userId", "userId must not be set on catalog exercises");
  }
  next();
});

exerciseSchema.index({ category: 1 });
exerciseSchema.index({ primaryMuscleGroup: 1 });
exerciseSchema.index({ "variants.equipment": 1 });
exerciseSchema.index({ userId: 1, isCustom: 1 });

export default mongoose.model<IExercise>("Exercise", exerciseSchema);
