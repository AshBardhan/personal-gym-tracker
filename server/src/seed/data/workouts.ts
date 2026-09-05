import { Equipment, SetType } from "@/types/exercise.js";
import { getWorkoutExerciseSnapshot } from "./exercises.js";
import { MOCK_USER_ID, workoutId } from "./ids.js";
import mongoose from "mongoose";

type ExerciseSet = {
  type: SetType;
  reps?: number;
  weight?: number;
  duration?: number;
};

type WorkoutExercise = ReturnType<typeof getWorkoutExerciseSnapshot> & {
  sets: ExerciseSet[];
};

const line = (
  slug: string,
  equipment: Equipment,
  sets: ExerciseSet[],
): WorkoutExercise => ({
  ...getWorkoutExerciseSnapshot(slug, equipment),
  sets,
});

const load = (
  ...entries: Array<[reps: number, weight: number, type?: SetType]>
): ExerciseSet[] =>
  entries.map(([reps, weight, type = "regular"]) => ({
    type,
    reps,
    ...(weight > 0 ? { weight } : {}),
  }));

const timed = (
  ...entries: Array<number | [duration: number, type?: SetType]>
): ExerciseSet[] =>
  entries.map((entry) => {
    if (typeof entry === "number") {
      return { type: "regular" as const, duration: entry };
    }
    const [duration, type = "regular"] = entry;
    return { type, duration };
  });

const repsOnly = (
  ...entries: Array<number | [reps: number, type?: SetType]>
): ExerciseSet[] =>
  entries.map((entry) => {
    if (typeof entry === "number") {
      return { type: "regular" as const, reps: entry };
    }
    const [reps, type = "regular"] = entry;
    return { type, reps };
  });

const workout = (
  id: string,
  title: string,
  date: string,
  exercises: WorkoutExercise[],
) => ({
  _id: workoutId(id),
  userId: new mongoose.Types.ObjectId(MOCK_USER_ID),
  title,
  date: new Date(`${date}T12:00:00.000Z`),
  exercises,
});

/**
 * 10 sessions:
 * - This week (1–5 Sep 2026): PPL + upper/lower, mixed equipment
 * - Previous week (24–28 Aug 2026): bro split, cable + machine only
 */
export const mockWorkouts = [
  // --- This week: PPL + Upper/Lower (1–5 Sep 2026) ---
  workout("10", "Lower", "2026-09-05", [
    line(
      "squats",
      "smith_machine",
      load(
        [15, 20, "warmup"],
        [12, 90],
        [10, 120],
        [8, 150],
        [4, 160, "failure"],
      ),
    ),
    line("romanian-deadlift", "barbell", load([10, 80], [8, 90], [8, 90])),
    line("leg-curl", "machine", load([12, 40], [10, 45], [10, 45, "failure"])),
    line(
      "bulgarian-split-squats",
      "dumbbell",
      load([10, 20], [10, 20], [8, 22.5]),
    ),
    line(
      "seated-calf-raises",
      "machine",
      load([15, 40], [15, 40], [12, 45], [20, 25, "drop"]),
    ),
    line("box-jumps", "body_weight", repsOnly(8, 8, [6, "failure"])),
  ]),
  workout("9", "Upper", "2026-09-04", [
    line("lateral-raises", "resistance_band", repsOnly(15, 15, 12)),
    line(
      "bench-press",
      "smith_machine",
      load([10, 40, "warmup"], [8, 75], [6, 80]),
    ),
    line("shoulder-press", "dumbbell", load([10, 28], [8, 30], [8, 30])),
    line(
      "lateral-raises",
      "cable",
      load(
        [20, 5, "warmup"],
        [15, 8],
        [12, 10, "drop"],
        [12, 10],
        [15, 6, "drop"],
      ),
    ),
    line(
      "bicep-curls",
      "ez_bar",
      load([12, 25], [10, 27.5], [10, 27.5, "failure"]),
    ),
    line("skull-crushers", "ez_bar", load([10, 22.5], [10, 25], [8, 27.5])),
    line("battle-ropes", "other", timed(30, 30, [20, "failure"])),
  ]),
  workout("8", "Legs", "2026-09-03", [
    line("squats", "barbell", load([8, 60, "warmup"], [8, 110], [6, 120])),
    line("leg-press", "machine", load([12, 160], [10, 180], [8, 200])),
    line("lunges", "dumbbell", load([10, 22.5], [10, 22.5], [8, 25])),
    line(
      "leg-extension",
      "machine",
      load([12, 50], [10, 55], [10, 55, "drop"]),
    ),
    line(
      "calf-raises",
      "machine",
      load([15, 60], [15, 60], [12, 70, "failure"]),
    ),
    line("swings", "kettlebell", load([15, 24], [12, 24], [12, 28])),
  ]),
  workout("7", "Pull", "2026-09-02", [
    line("deadlift", "barbell", load([5, 80, "warmup"], [4, 150], [3, 155])),
    line(
      "pull-ups",
      "body_weight",
      load([8, 0], [6, 0], [6, 5], [4, 0, "failure"]),
    ),
    line("seated-row", "cable", load([12, 55], [10, 60], [10, 60])),
    line("bent-over-row", "dumbbell", load([10, 32.5], [10, 35], [8, 37.5])),
    line("face-pulls", "resistance_band", repsOnly(15, 15, [12, "drop"])),
    line("hammer-curls", "dumbbell", load([12, 16], [10, 18], [10, 18])),
  ]),
  workout("6", "Push", "2026-09-01", [
    line("bench-press", "barbell", load([10, 50, "warmup"], [8, 85], [6, 90])),
    line(
      "incline-bench-press",
      "dumbbell",
      load([10, 30], [8, 32.5], [8, 32.5]),
    ),
    line("pec-deck", "machine", load([12, 45], [12, 50], [10, 50, "drop"])),
    line("chest-fly", "cable", load([15, 12.5], [12, 15], [12, 15])),
    line(
      "overhead-tricep-extension",
      "dumbbell",
      load([12, 20], [10, 22.5], [10, 22.5, "failure"]),
    ),
    line("push-ups", "body_weight", repsOnly(15, 12, [10, "failure"])),
    line("turkish-get-ups", "kettlebell", load([6, 16], [5, 16], [5, 16])),
  ]),

  // --- Previous week: bro split, cable + machine (24–28 Aug 2026) ---
  workout("5", "Core", "2026-08-28", [
    line("crunches", "cable", load([15, 20], [12, 25], [12, 25, "failure"])),
    line("russian-twists", "cable", load([20, 15], [16, 17.5], [16, 17.5])),
    line("leg-raises", "machine", repsOnly(12, 10, 10)),
    line("hanging-leg-raises", "machine", repsOnly(10, 8, [8, "failure"])),
  ]),
  workout("4", "Arms and Shoulders", "2026-08-27", [
    line(
      "shoulder-press",
      "machine",
      load([10, 25, "warmup"], [8, 45], [8, 45]),
    ),
    line(
      "lateral-raises",
      "cable",
      load([15, 8], [12, 10], [12, 10], [18, 5, "drop"]),
    ),
    line("rear-delt-fly", "machine", load([15, 20], [12, 25], [12, 25])),
    line("upright-row", "cable", load([12, 25], [10, 30], [10, 30])),
    line(
      "bicep-curls",
      "cable",
      load([12, 20], [10, 22.5], [10, 22.5, "failure"]),
    ),
    line(
      "tricep-pushdown",
      "cable",
      load([12, 28], [10, 32], [10, 32], [14, 20, "drop"]),
    ),
    line(
      "overhead-tricep-extension",
      "cable",
      load([12, 18], [10, 20], [10, 20]),
    ),
  ]),
  workout("3", "Legs", "2026-08-26", [
    line("leg-press", "machine", load([12, 90, "warmup"], [10, 170], [8, 190])),
    line("hack-squats", "machine", load([10, 80], [8, 90], [8, 90])),
    line(
      "leg-extension",
      "machine",
      load([12, 45], [12, 50], [10, 50, "drop"]),
    ),
    line("leg-curl", "machine", load([12, 38], [10, 42], [10, 42])),
    line("hip-thrusts", "machine", load([10, 70], [10, 80], [8, 85])),
    line(
      "calf-raises",
      "machine",
      load([15, 55], [15, 55], [12, 65, "failure"]),
    ),
  ]),
  workout("2", "Back", "2026-08-25", [
    line("lat-pulldown", "cable", load([12, 35, "warmup"], [10, 60], [10, 65])),
    line("seated-row", "cable", load([12, 50], [10, 55], [10, 55])),
    line(
      "face-pulls",
      "cable",
      load([15, 20], [15, 22.5], [12, 25], [20, 12.5, "drop"]),
    ),
    line("rear-delt-fly", "cable", load([15, 10], [12, 12.5], [12, 12.5])),
    line("shrugs", "machine", load([12, 40], [10, 45], [10, 45, "failure"])),
  ]),
  workout("1", "Chest", "2026-08-24", [
    line("bench-press", "machine", load([10, 40, "warmup"], [8, 75], [8, 80])),
    line("incline-bench-press", "machine", load([10, 50], [8, 55], [8, 55])),
    line("pec-deck", "machine", load([12, 40], [12, 45], [10, 45, "drop"])),
    line("chest-fly", "cable", load([15, 12.5], [12, 15], [12, 15, "failure"])),
  ]),
];
