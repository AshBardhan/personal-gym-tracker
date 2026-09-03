import { useState, useEffect, useCallback } from "react";
import { Exercise } from "@/types/entities";
import { exerciseService } from "@/services/exercises.service";

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getAll();
      setExercises(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exercises. Make sure the server is running.");
      console.error("Error fetching exercises:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, setExercises, loading, error, refetch: fetchExercises };
};
