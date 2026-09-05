import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "@/models/User.js";
import Exercise from "@/models/Exercise.js";
import Workout from "@/models/Workout.js";
import {
  mockUser,
  mockExercises,
  mockWorkouts,
} from "./data/index.js";

const COLLECTIONS = ["users", "exercises", "workouts"] as const;

const dropCollection = async (name: string): Promise<void> => {
  try {
    await mongoose.connection.dropCollection(name);
    console.log(`Dropped collection: ${name}`);
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 26) {
      console.log(`Collection not found (skipped): ${name}`);
      return;
    }
    throw error;
  }
};

const seed = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const name of COLLECTIONS) {
    await dropCollection(name);
  }

  const user = await User.create(mockUser);
  const exercises = await Exercise.insertMany(mockExercises);
  const workouts = await Workout.insertMany(mockWorkouts);

  console.log("\nSeed complete:");
  console.log(`  Users:     ${user._id} (${user.email})`);
  console.log(`  Exercises: ${exercises.length}`);
  console.log(`  Workouts:  ${workouts.length}`);
};

seed()
  .catch((error) => {
    console.error("Seed failed:", (error as Error).message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });
