import apiClient from "@/services/apiClient";
import { Workout } from "@/types/entities";
import { AxiosResponse } from "axios";

export type WorkoutWrite = Omit<Workout, "_id" | "createdAt" | "updatedAt">;

/**
 * Workout API service
 * Handles all workout-related API calls
 */
export const workoutService = {
  /**
   * Get all workouts for a specific user
   */
  getAllByUser: async (userId: string): Promise<Workout[]> => {
    const response: AxiosResponse<Workout[]> = await apiClient.get(
      `/workouts/${userId}`,
    );
    return response.data;
  },

  /**
   * Get a single workout by ID
   */
  getById: async (id: string): Promise<Workout> => {
    const response: AxiosResponse<Workout> = await apiClient.get(
      `/workouts/detail/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new workout
   */
  create: async (workoutData: WorkoutWrite): Promise<Workout> => {
    const response: AxiosResponse<Workout> = await apiClient.post(
      "/workouts",
      workoutData,
    );
    return response.data;
  },

  /**
   * Update an existing workout
   */
  update: async (
    id: string,
    workoutData: Partial<WorkoutWrite>,
  ): Promise<Workout> => {
    const response: AxiosResponse<Workout> = await apiClient.put(
      `/workouts/${id}`,
      workoutData,
    );
    return response.data;
  },

  /**
   * Delete a workout
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workouts/${id}`);
  },
};
