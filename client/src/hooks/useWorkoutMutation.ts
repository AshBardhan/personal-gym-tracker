import { useState } from "react";
import { Workout } from "../types/workout";
import { workoutService } from "../services/api/workouts.service";

/**
 * Custom hook for workout mutations (create, update, delete)
 * Encapsulates loading and error state for mutation operations
 */
export const useWorkoutMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWorkout = async (
    data: Partial<Workout>
  ): Promise<Workout | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await workoutService.create(data);
      console.log("Workout created successfully");
      return result;
    } catch (err) {
      setError("Failed to create workout");
      console.error("Error creating workout:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkout = async (
    id: string,
    data: Partial<Workout>
  ): Promise<Workout | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await workoutService.update(id, data);
      console.log("Workout updated successfully:", id);
      return result;
    } catch (err) {
      setError("Failed to update workout");
      console.error("Error updating workout:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await workoutService.delete(id);
      console.log("Workout deleted successfully:", id);
      return true;
    } catch (err) {
      setError("Failed to delete workout");
      console.error("Error deleting workout:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createWorkout, updateWorkout, deleteWorkout, loading, error };
};
