import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error handler caught an error:", error);
  return res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
};
