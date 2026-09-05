import mongoose from "mongoose";
import { MOCK_USER_ID } from "./ids.js";

export const mockUser = {
  _id: new mongoose.Types.ObjectId(MOCK_USER_ID),
  name: "Demo User",
  email: "demo@gymtracker.com",
  isAdmin: true,
};
