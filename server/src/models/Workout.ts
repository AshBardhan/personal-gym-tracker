import mongoose, { Document, Schema } from "mongoose";

export interface ISet {
  reps: number;
  weight: number;
}

export interface IExercise {
  name: string;
  sets: ISet[];
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  date: Date;
  exercises: IExercise[];
  createdAt: Date;
}

const setSchema = new Schema<ISet>({
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    required: true,
    default: 0,
  },
});

const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: [setSchema],
    required: true,
    default: [],
  },
});

const workoutSchema = new Schema<IWorkout>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  exercises: {
    type: [exerciseSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IWorkout>("Workout", workoutSchema);
