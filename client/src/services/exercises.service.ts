import apiClient from "@/services/apiClient";
import { Exercise } from "@/types/entities";
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
};
