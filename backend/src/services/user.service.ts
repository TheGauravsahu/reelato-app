import createHttpError from "http-errors";
import { IUser, userModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

class UserService {
  async createUser({ email, password, fullName }: Partial<IUser>) {
    const existingActiveUser = await userModel.findOne({
      email,
      isActive: true,
    });
    if (existingActiveUser) {
      throw createHttpError(409, "User already exists with this email.");
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
      const hashedPassword = await bcrypt.hash(password!, 10);
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

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    };
  }

  async loginUser({ email, password }: Partial<IUser>) {
    const user = await userModel
      .findOne({ email, isActive: true })
      .select("+password");
    if (!user) {
      throw createHttpError(409, "User does not exists with this email.");
    }

    const isPasswordMatch = await bcrypt.compare(password!, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(409, "Invalid credentials.");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      config.JWT_SECRET
    );

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    };
  }

  async updateUserProfile(userId: string, { fullName, email }: Partial<IUser>) {
    return await userModel.findByIdAndUpdate(userId, {
      fullName,
      email,
    });
  }
}

export const userService = new UserService();
