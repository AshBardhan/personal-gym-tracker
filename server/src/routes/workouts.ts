import express, { Request, Response } from "express";
import Workout from "../models/Workout.js";

const router = express.Router();

// Get all workouts for a user
router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({
      date: -1,
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get single workout
router.get(
  "/detail/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        res.status(404).json({ message: "Workout not found" });
        return;
      }
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
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
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update workout
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    if (req.body.title !== undefined) workout.title = req.body.title;
    if (req.body.date) workout.date = req.body.date;
    if (req.body.exercises) workout.exercises = req.body.exercises;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Delete workout
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    await workout.deleteOne();
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
