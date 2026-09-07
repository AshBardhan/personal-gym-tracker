import axios, { AxiosResponse } from "axios";
import { config } from "@/config/env";
import { ApiResponse } from "@/types/api";

/**
 * Get the data from the API response
 * @param response - The API response
 * @returns The data from the API response
 */
const getApiResponseData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const body = response.data;

  if (!body.success) {
    throw new Error(body.error?.message ?? "Request failed");
  }

  return body.data as T;
};

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
  (requestConfig) => {
    // Future: Add auth token here
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   requestConfig.headers.Authorization = `Bearer ${token}`;
    // }
    return requestConfig;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - unwrap ApiResponse and normalize errors
apiClient.interceptors.response.use(
  (response) => {
    response.data = getApiResponseData(response);
    return response;
  },
  (error) => {
    const body = error.response?.data as ApiResponse<unknown> | undefined;
    const message = body?.error?.message ?? error.message ?? "Request failed";

    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
