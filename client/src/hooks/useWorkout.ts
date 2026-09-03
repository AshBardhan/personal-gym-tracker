import { useState, useEffect, useCallback } from "react";
import { Workout } from "@/types/entities";
import { workoutService } from "@/services/workouts.service";

/**
 * Custom hook to fetch a single workout by ID
 * Encapsulates loading, error, and data state management
 */
export const useWorkout = (id: string | undefined) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkout = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await workoutService.getById(id);
      setWorkout(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch workout details");
      console.error("Error fetching workout:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  return { workout, loading, error, refetch: fetchWorkout };
};
