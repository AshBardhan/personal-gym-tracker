import express, { Request, Response } from "express";
import Workout from "@/models/Workout.js";
import { sendError, sendSuccess } from "@/utils/api.js";

const router = express.Router();

// Get all workouts for a user
router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({
      date: -1,
    });
    sendSuccess(res, workouts);
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

// Get single workout
router.get(
  "/detail/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        sendError(res, "Workout not found", 404);
        return;
      }
      sendSuccess(res, workout);
    } catch (error) {
      sendError(res, (error as Error).message);
    }
  },
);

// Create new workout
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const workout = new Workout({
    userId: req.body.userId,
    title: req.body.title,
    date: req.body.date || new Date(),
    exercises: req.body.exercises || [],
  });

  try {
    const newWorkout = await workout.save();
    sendSuccess(res, newWorkout, 201);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Update workout
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      sendError(res, "Workout not found", 404);
      return;
    }

    if (req.body.title !== undefined) workout.title = req.body.title;
    if (req.body.date) workout.date = req.body.date;
    if (req.body.exercises) workout.exercises = req.body.exercises;

    const updatedWorkout = await workout.save();
    sendSuccess(res, updatedWorkout);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Delete workout
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      sendError(res, "Workout not found", 404);
      return;
    }

    await workout.deleteOne();
    sendSuccess(res, { message: "Workout deleted successfully" });
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

export default router;
