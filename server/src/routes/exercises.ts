import express, { Request, Response } from "express";
import Exercise from "@/models/Exercise.js";
import { sendError, sendSuccess } from "@/utils/api.js";

const router = express.Router();

// Get all exercises
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    sendSuccess(res, exercises);
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

// Get single exercise
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      sendError(res, "Exercise not found", 404);
      return;
    }
    sendSuccess(res, exercise);
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

// Create exercise
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const exercise = new Exercise({
    name: req.body.name,
    category: req.body.category,
    primaryMuscleGroup: req.body.primaryMuscleGroup,
    secondaryMuscleGroups: req.body.secondaryMuscleGroups,
    isCustom: req.body.isCustom ?? true,
    userId: req.body.userId,
    variants: req.body.variants,
  });

  try {
    const newExercise = await exercise.save();
    sendSuccess(res, newExercise, 201);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Update exercise
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      sendError(res, "Exercise not found", 404);
      return;
    }

    if (req.body.name !== undefined) exercise.name = req.body.name;
    if (req.body.category !== undefined) exercise.category = req.body.category;
    if (req.body.primaryMuscleGroup !== undefined) {
      exercise.primaryMuscleGroup = req.body.primaryMuscleGroup;
    }
    if (req.body.secondaryMuscleGroups !== undefined) {
      exercise.secondaryMuscleGroups = req.body.secondaryMuscleGroups;
    }
    if (req.body.isCustom !== undefined) exercise.isCustom = req.body.isCustom;
    if (req.body.userId !== undefined) exercise.userId = req.body.userId;
    if (req.body.variants !== undefined) exercise.variants = req.body.variants;

    const updatedExercise = await exercise.save();
    sendSuccess(res, updatedExercise);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Delete exercise
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      sendError(res, "Exercise not found", 404);
      return;
    }

    await exercise.deleteOne();
    sendSuccess(res, { message: "Exercise deleted successfully" });
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

export default router;
