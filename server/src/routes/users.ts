import express, { Request, Response } from "express";
import User from "@/models/User.js";
import { sendError, sendSuccess } from "@/utils/api.js";

const router = express.Router();

// Get all users
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    sendSuccess(res, users);
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

// Get single user
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

// Create new user
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });

  try {
    const newUser = await user.save();
    sendSuccess(res, newUser, 201);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Update user
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    const updatedUser = await user.save();
    sendSuccess(res, updatedUser);
  } catch (error) {
    sendError(res, (error as Error).message, 400);
  }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    await user.deleteOne();
    sendSuccess(res, { message: "User deleted successfully" });
  } catch (error) {
    sendError(res, (error as Error).message);
  }
});

export default router;
