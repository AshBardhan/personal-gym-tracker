import axios, { AxiosResponse } from "axios";
import { User, Workout } from "../types";

const API_URL = "http://localhost:5000/api";

// User API calls
export const userAPI = {
  getAll: (): Promise<AxiosResponse<User[]>> => axios.get(`${API_URL}/users`),
  getById: (id: string): Promise<AxiosResponse<User>> =>
    axios.get(`${API_URL}/users/${id}`),
  create: (userData: Partial<User>): Promise<AxiosResponse<User>> =>
    axios.post(`${API_URL}/users`, userData),
  update: (id: string, userData: Partial<User>): Promise<AxiosResponse<User>> =>
    axios.put(`${API_URL}/users/${id}`, userData),
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    axios.delete(`${API_URL}/users/${id}`),
};

// Workout API calls
export const workoutAPI = {
  getAllByUser: (userId: string): Promise<AxiosResponse<Workout[]>> =>
    axios.get(`${API_URL}/workouts/${userId}`),
  getById: (id: string): Promise<AxiosResponse<Workout>> =>
    axios.get(`${API_URL}/workouts/detail/${id}`),
  create: (workoutData: Partial<Workout>): Promise<AxiosResponse<Workout>> =>
    axios.post(`${API_URL}/workouts`, workoutData),
  update: (
    id: string,
    workoutData: Partial<Workout>,
  ): Promise<AxiosResponse<Workout>> =>
    axios.put(`${API_URL}/workouts/${id}`, workoutData),
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    axios.delete(`${API_URL}/workouts/${id}`),
};
