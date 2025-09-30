import { foodPartnerModel, IFoodPartner } from "../models/foodPartner.model";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import config from "../config";
import { IUser, userModel } from "../models/user.model";

export async function authFoodPartner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    return next(createHttpError(401, "Authentication token missing."));
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const foodPartner = await foodPartnerModel.findById((decoded as any).id);
    if (!foodPartner) {
      return next(createHttpError(401, "user not found."));
    }
    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    console.log("error in food partner auth middleware: ", error);
    next(createHttpError(401, "Authentication failed for food partner."));
  }
}

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    return next(createHttpError(401, "Authentication token missing."));
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findOne({
      _id: (decoded as any).id,
      isActive: true,
    });
    if (!user) {
      return next(createHttpError(401, "User not found."));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in user auth middleware: ", error);
    next(createHttpError(401, "Authentication failed for user."));
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      foodPartner?: IFoodPartner;
    }
  }
}
