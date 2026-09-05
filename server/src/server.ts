import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "@/config/db.js";
import userRoutes from "@/routes/users.js";
import workoutRoutes from "@/routes/workouts.js";
import exerciseRoutes from "@/routes/exercises.js";
import { sendError, sendSuccess } from "@/utils/api.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);

// Basic route
app.get("/", (_req: Request, res: Response) => {
  sendSuccess(res, { message: "Gym Tracker API is running" });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  sendError(res, "Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
