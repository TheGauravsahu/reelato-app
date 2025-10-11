import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { foodPartnerModel } from "../models/foodPartner.model";

export class AuthController {
  constructor() {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body;

      const existingActiveUser = await userModel.findOne({
        email,
        isActive: true,
      });
      if (existingActiveUser) {
        return next(
          createHttpError(409, "User already exists with this email.")
        );
      }

      let user = await userModel.findOne({ email, isActive: false });
      if (user) {
        user.isActive = true;
        if (password) {
          // update password too (in case user provides new one)
          user.password = await bcrypt.hash(password, 10);
        }
        if (fullName) {
          user.fullName = fullName;
        }
        await user.save();
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await userModel.create({
          fullName,
          email,
          password: hashedPassword,
          isActive: true,
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        config.JWT_SECRET
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "User registered successfully.",
        data: {
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      console.log("error creating user: ", error);
      next(createHttpError(400, "Failed to register user."));
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await userModel
        .findOne({ email, isActive: true })
        .select("+password");
      if (!user) {
        return next(
          createHttpError(409, "User does not exists with this email.")
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return next(createHttpError(409, "Invalid credentials."));
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        config.JWT_SECRET
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "User logged in successfully.",
        data: {
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      console.log("error logging user: ", error);
      next(createHttpError(400, "Failed to login user."));
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000)); (test)
      return res.status(200).json({
        message: "User profile fetched successfully.",
        data: { user: req.user, token: req.cookies.token },
      });
    } catch (error) {
      console.log("error getting user profile: ", error);
      next(createHttpError(400, "Failed to get user profile."));
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email } = req.body;

      const user = await userModel.findByIdAndUpdate(req?.user?._id, {
        fullName,
        email,
      });

      return res.status(200).json({
        message: "Account details updated successfully.",
        data: {
          _id: user?._id,
          fullName: user?.fullName,
          email: user?.email,
        },
      });
    } catch (error) {
      next(createHttpError(400, "Failed to update user profile."));
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userModel.findByIdAndUpdate(req?.user?._id, {
        isActive: false,
      });
      return res.status(200).json({
        message: "Account deleted successfully.",
      });
    } catch (error) {
      console.log("error deleting user account", error);
      next(createHttpError(400, "failed to delete your account."));
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token");
      return res.status(200).json({
        message: "User logged out successfully.",
      });
    } catch (error) {
      console.log("error logging out user: ", error);
      next(createHttpError(400, "Failed to log out user."));
    }
  }

  async registerFoodPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password, contactName, phone, address } =
        req.body;

      const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({
        email,
      });
      if (isFoodPartnerAlreadyExists) {
        return next(
          createHttpError(409, "User already exists with this email.")
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const foodPartner = await foodPartnerModel.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName,
      });

      const token = jwt.sign(
        {
          id: foodPartner._id,
          email: foodPartner.email,
        },
        config.JWT_SECRET
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "Food Partner registered successfully.",
        data: {
          _id: foodPartner._id,
          fullName: foodPartner.fullName,
          email: foodPartner.email,
          phone: foodPartner.phone,
          address: foodPartner.address,
          contactName: foodPartner.contactName,
        },
      });
    } catch (error) {
      console.log("error creating food partner: ", error);
      next(createHttpError(400, "Failed to register food partner."));
    }
  }

  async loginFoodPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const foodPartner = await foodPartnerModel.findOne({ email });
      if (!foodPartner) {
        return next(
          createHttpError(409, "food partner does not exists with this email.")
        );
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        foodPartner.password
      );
      if (!isPasswordMatch) {
        return next(createHttpError(409, "Invalid credentials."));
      }

      const token = jwt.sign(
        {
          id: foodPartner._id,
          email: foodPartner.email,
          phone: foodPartner.phone,
          address: foodPartner.address,
          contactName: foodPartner.contactName,
        },
        config.JWT_SECRET
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({
        message: "food partner logged in successfully.",
        data: {
          _id: foodPartner._id,
          fullName: foodPartner.fullName,
          email: foodPartner.email,
        },
      });
    } catch (error) {
      console.log("error creating food partner: ", error);
      next(createHttpError(400, "Failed to register food partner."));
    }
  }

  async getFoodPartnerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: "Food partner profile fetched successfully.",
        data: req.foodPartner,
      });
    } catch (error) {
      console.log("error getting food partner profile: ", error);
      next(createHttpError(400, "Failed to get food partner profile."));
    }
  }

  async updatFoodPartnerProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req?.foodPartner?._id;
      const { fullName, email } = req.body;

      const foodPartner = await foodPartnerModel.findByIdAndUpdate(id, {
        fullName,
        email,
      });

      return res.status(200).json({
        message: "Account details updated successfully.",
        data: {
          _id: foodPartner?._id,
          fullName: foodPartner?.fullName,
          email: foodPartner?.email,
        },
      });
    } catch (error) {
      console.log("error updating food partner profile: ", error);
      next(createHttpError(400, "Failed to "));
    }
  }

  async logoutFoodPartner(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token");
      return res.status(200).json({
        message: "Food partner logged out successfully.",
      });
    } catch (error) {
      console.log("error logging out food partner: ", error);
      next(createHttpError(400, "Failed to log out food partner."));
    }
  }
}
