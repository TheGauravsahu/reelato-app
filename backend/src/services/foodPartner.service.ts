import createHttpError from "http-errors";
import config from "../config";
import { foodPartnerModel, IFoodPartner } from "../models/foodPartner.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IFood } from "../models/food.model";

class FoodPartnerService {
  async createFoodPartner({
    fullName,
    email,
    password,
    contactName,
    phone,
    address,
  }: Partial<IFoodPartner>) {
    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({
      email,
      isActive: true,
    });
    if (isFoodPartnerAlreadyExists) {
      throw createHttpError(
        409,
        "Food Partner already exists with this email."
      );
    }

    let foodPartner = await foodPartnerModel.findOne({
      email,
      isActive: false,
    });
    if (foodPartner) {
      foodPartner.isActive = true;
      if (password) {
        // update password too (in case user provides new one)
        foodPartner.password = await bcrypt.hash(password!, 10);
      }
      if (fullName) {
        foodPartner.fullName = fullName;
      }
      await foodPartner.save();
    } else {
      const hashedPassword = await bcrypt.hash(password!, 10);
      foodPartner = await foodPartnerModel.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName,
      });
    }

    const token = jwt.sign(
      {
        id: foodPartner?._id,
        email: foodPartner?.email,
      },
      config.JWT_SECRET
    );

    return {
      foodPartner: {
        _id: foodPartner._id,
        fullName: foodPartner.fullName,
        email: foodPartner.email,
        phone: foodPartner.phone,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
      },
      token,
    };
  }

  async loginFoodPartner({ email, password }: Partial<IFoodPartner>) {
    const foodPartner = await foodPartnerModel
      .findOne({ email, isActive: true })
      .select("+password");

    if (!foodPartner) {
      throw createHttpError(
        409,
        "food partner does not exists with this email."
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password!,
      foodPartner.password
    );
    if (!isPasswordMatch) {
      throw createHttpError(409, "Invalid credentials.");
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

    return {
      foodPartner: {
        _id: foodPartner._id,
        fullName: foodPartner.fullName,
        email: foodPartner.email,
        phone: foodPartner.phone,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
      },
      token,
    };
  }

  async updateFoodPartnerProfile(
    id: string,
    { fullName, email }: Partial<IFoodPartner>
  ) {
    return await foodPartnerModel.findByIdAndUpdate(id, {
      fullName,
      email,
    });
  }
}

export const foodPartnerService = new FoodPartnerService();
