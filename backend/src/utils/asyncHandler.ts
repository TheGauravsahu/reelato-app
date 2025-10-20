import { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Caught error:", error);
      if (isHttpError(error)) {
        return next(error);
      }
      next(createHttpError(500, "Something went wrong."));
    }
  };
};
