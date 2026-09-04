import apiClient from "@/services/apiClient";
import { Exercise } from "@/types/entities";
import { ExerciseWrite } from "@/utils/exerciseUtils";
import { AxiosResponse } from "axios";

export const exerciseService = {
  getAll: async (): Promise<Exercise[]> => {
    const response: AxiosResponse<Exercise[]> =
      await apiClient.get("/exercises");
    return response.data;
  },

  getById: async (id: string): Promise<Exercise> => {
    const response: AxiosResponse<Exercise> = await apiClient.get(
      `/exercises/${id}`,
    );
    return response.data;
  },

  create: async (exerciseData: ExerciseWrite): Promise<Exercise> => {
    const response: AxiosResponse<Exercise> = await apiClient.post(
      "/exercises",
      exerciseData,
    );
    return response.data;
  },

  update: async (
    id: string,
    exerciseData: Partial<ExerciseWrite>,
  ): Promise<Exercise> => {
    const response: AxiosResponse<Exercise> = await apiClient.put(
      `/exercises/${id}`,
      exerciseData,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/exercises/${id}`);
  },
};
