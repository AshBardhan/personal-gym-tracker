import { Schema } from "mongoose";
import { SET_TYPES, type SetType } from "@/types/exercise.js";

/**
 * Subdocument — embedded in workout exercises, not a top-level collection.
 * Volume is derived from weight (and reps when both are tracked); duration is ignored.
 * See `getSetVolume` in types.ts.
 */
export interface ISet {
  type: SetType;
  reps?: number;
  weight?: number;
  duration?: number;
}

export const setSchema = new Schema<ISet>(
  {
    type: {
      type: String,
      enum: SET_TYPES,
      required: true,
      default: "regular",
    },
    reps: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    duration: {
      type: Number,
      min: 0,
    },
  },
  { _id: true },
);
