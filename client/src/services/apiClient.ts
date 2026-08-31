import axios from "axios";
import { config } from "@/config/env";

/**
 * Configured axios instance for API calls
 */
const apiClient = axios.create({
  baseURL: config.api.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - can be extended for auth tokens in the future
apiClient.interceptors.request.use(
  (config) => {
    // Future: Add auth token here
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
