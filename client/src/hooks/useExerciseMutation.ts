import { useState } from "react";
import { Exercise } from "@/types/entities";
import { exerciseService } from "@/services/exercises.service";
import { ExerciseWrite } from "@/utils/exerciseUtils";

export const useExerciseMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExercise = async (
    data: ExerciseWrite,
  ): Promise<Exercise | null> => {
    try {
      setLoading(true);
      setError(null);
      return await exerciseService.create(data);
    } catch (err) {
      setError("Failed to create exercise");
      console.error("Error creating exercise:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = async (
    id: string,
    data: Partial<ExerciseWrite>,
  ): Promise<Exercise | null> => {
    try {
      setLoading(true);
      setError(null);
      return await exerciseService.update(id, data);
    } catch (err) {
      setError("Failed to update exercise");
      console.error("Error updating exercise:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await exerciseService.delete(id);
      return true;
    } catch (err) {
      setError("Failed to delete exercise");
      console.error("Error deleting exercise:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createExercise, updateExercise, deleteExercise, loading, error };
};
