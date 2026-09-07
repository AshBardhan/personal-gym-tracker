import apiClient from "@/lib/apiClient";
import { HttpMethod } from "@/types/api";

export const apiRequest = async <TResponse, TRequest = unknown>(
  method: HttpMethod,
  endpoint: string,
  body?: TRequest,
): Promise<TResponse> => {
  switch (method) {
    case "GET": {
      const response = await apiClient.get<TResponse>(endpoint);
      return response.data;
    }
    case "POST": {
      const response = await apiClient.post<TResponse>(endpoint, body);
      return response.data;
    }
    case "PUT": {
      const response = await apiClient.put<TResponse>(endpoint, body);
      return response.data;
    }
    case "PATCH": {
      const response = await apiClient.patch<TResponse>(endpoint, body);
      return response.data;
    }
    case "DELETE": {
      await apiClient.delete(endpoint);
      return undefined as TResponse;
    }
  }
};
