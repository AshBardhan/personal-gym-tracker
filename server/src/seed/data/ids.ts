import { createHash } from "node:crypto";
import mongoose from "mongoose";

/** Matches client VITE_DEMO_USER_ID / MOCK_USER_ID. */
export const MOCK_USER_ID = "673092a6fd2a34e8e4b91234";

/** Deterministic ObjectIds so workouts can reference catalog rows reliably. */
export const seedObjectId = (
  namespace: string,
  key: string,
): mongoose.Types.ObjectId => {
  const hex = createHash("sha256")
    .update(`${namespace}:${key}`)
    .digest("hex")
    .slice(0, 24);
  return new mongoose.Types.ObjectId(hex);
};

export const exerciseId = (slug: string) => seedObjectId("exercise", slug);

export const variantId = (slug: string, equipment: string) =>
  seedObjectId("variant", `${slug}:${equipment}`);

export const workoutId = (id: string) => seedObjectId("workout", id);
