import { ApiResponse } from "@/types/api";

export const mockSuccess = <T>(
  data: T,
  status = 200,
): { body: ApiResponse<T>; status: number } => ({
  body: { success: true, data },
  status,
});

export const mockError = (
  message: string,
  status = 404,
): { body: ApiResponse<never>; status: number } => ({
  body: { success: false, error: { message } },
  status,
});
