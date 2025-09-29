import { Request, NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { foodModel, IFood } from "../models/food.model";
import { v4 as uuid } from "uuid";
import { uploadFile } from "../services/storage.service";

export class FoodController {
  constructor() {}

  async createFood(req: Request, res: Response, next: NextFunction) {
    console.log(req);
    const { name, description } = req.body as IFood;
    const file = req.file;
    if (!file) {
      return next(createHttpError(400, "No file uploaded"));
    }
    if (!name || !description) {
      return next(createHttpError(400, "Missing required fields"));
    }

    try {
      const videoUrl = await uploadFile(file, uuid());
      const food = await foodModel.create({
        name,
        description,
        videoUrl,
        foodPartner: req?.foodPartner?._id,
      });
      return res.status(201).json({
        message: "Food created successfully",
        data: food,
      });
    } catch (error) {
      return next(createHttpError(500, "failed to create food"));
    }
  }

  async getFoodItems(req: Request, res: Response, next: NextFunction) {
    try {
      const foodItems = await foodModel
        .find()
        .populate("foodPartner", "fullName");
      return res.status(200).json({
        message: "Food items fetched successfully",
        data: foodItems,
      });
    } catch (error) {
      console.log("error in get food items: ", error);
      next(createHttpError(500, "failed to fetch food items"));
    }
  }
}
