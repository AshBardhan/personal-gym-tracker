import apiClient from "@/services/apiClient";
import { User } from "@/types/entities";
import { AxiosResponse } from "axios";

/**
 * User API service
 * Handles all user-related API calls
 */
export const userService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await apiClient.get("/users");
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  create: async (userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.post(
      "/users",
      userData,
    );
    return response.data;
  },

  /**
   * Update an existing user
   */
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.put(
      `/users/${id}`,
      userData,
    );
    return response.data;
  },

  /**
   * Delete a user
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
