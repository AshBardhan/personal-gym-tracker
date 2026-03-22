import { useState, useEffect, useCallback } from "react";
import { Workout } from "../types/workout";
import { workoutService } from "../services/api/workouts.service";

/**
 * Custom hook to fetch all workouts for a user
 * Encapsulates loading, error, and data state management
 */
export const useWorkouts = (userId: string | null) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await workoutService.getAllByUser(userId);
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch workouts. Make sure the server is running.");
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refetch: fetchWorkouts };
};
