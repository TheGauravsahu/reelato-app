import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user.model";
import { userService } from "../services/user.service";
import { foodPartnerService } from "../services/foodPartner.service";
import { asyncHandler } from "../utils/asyncHandler";
import { foodPartnerModel } from "../models/foodPartner.model";

export class AuthController {
  registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userService.createUser(req.body);
      res.cookie("token", data.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "User registered successfully.",
        data,
      });
    }
  );

  loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userService.loginUser(req.body);
      res.cookie("token", data.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        message: "User logged in successfully.",
        data,
      });
    }
  );

  getUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        message: "User profile fetched successfully.",
        data: { user: req.user, token: req.cookies.token },
      });
    }
  );

  updateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userService.updateUserProfile(
        req?.user?._id as string,
        req.body
      );

      return res.status(200).json({
        message: "Account details updated successfully.",
        data,
      });
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userModel.findByIdAndUpdate(req?.user?._id, {
        isActive: false,
      });
      return res.status(200).json({
        message: "Account deleted successfully.",
      });
    }
  );

  logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie("token");
      return res.status(200).json({
        message: "User logged out successfully.",
      });
    }
  );

  // food partner
  registerFoodPartner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await foodPartnerService.createFoodPartner(req.body);

      res.cookie("token", data.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "Food Partner registered successfully.",
        data,
      });
    }
  );

  loginFoodPartner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await foodPartnerService.loginFoodPartner(req.body);
      res.cookie("token", data.token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        message: "Food partner logged in successfully.",
        data,
      });
    }
  );

  getFoodPartnerProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        message: "Food partner profile fetched successfully.",
        data: { foodPartner: req.foodPartner, token: req.cookies.token },
      });
    }
  );

  updatFoodPartnerProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req?.foodPartner?._id;
      const data = await foodPartnerService.updateFoodPartnerProfile(
        id as string,
        req.body
      );

      return res.status(200).json({
        message: "Account details updated successfully.",
        data,
      });
    }
  );

  deleteFoodPartner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await foodPartnerModel.findByIdAndUpdate(req?.foodPartner?._id, {
        isActive: false,
      });
      return res.status(200).json({
        message: "Account deleted successfully.",
      });
    }
  );
  logoutFoodPartner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie("token");
      return res.status(200).json({
        message: "Food partner logged out successfully.",
      });
    }
  );
}
