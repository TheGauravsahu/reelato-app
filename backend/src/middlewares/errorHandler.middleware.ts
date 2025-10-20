import { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error handler caught an error:", error);

  if (isHttpError(error)) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
};
