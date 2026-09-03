import { useState, useEffect, useCallback } from "react";
import { Exercise } from "@/types/entities";
import { exerciseService } from "@/services/exercises.service";

export const useExercise = (id: string | undefined) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercise = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await exerciseService.getById(id);
      setExercise(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exercise details");
      console.error("Error fetching exercise:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  return { exercise, loading, error, refetch: fetchExercise };
};
