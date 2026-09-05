import { Response } from "express";
import { ApiResponse } from "@/types/api";

export const sendSuccess = <T>(res: Response, data: T, status = 200): void => {
  res.status(status).json({ success: true, data } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message: string,
  status = 500,
): void => {
  res
    .status(status)
    .json({ success: false, error: { message } } as ApiResponse<never>);
};
