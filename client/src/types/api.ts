/**
 * HTTP methods for API requests
 */
export type QueryMethod = "GET";
export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";
export type HttpMethod = QueryMethod | MutationMethod;

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
