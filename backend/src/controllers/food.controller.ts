import { Request, NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { foodModel, IFood } from "../models/food.model";
import { v4 as uuid } from "uuid";
import { uploadFile } from "../services/storage.service";
import { likeModel } from "../models/like.model";
import { saveModel } from "../models/save.model";

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
      const userId = req?.user?._id;
      const foodItems = await foodModel
        .find()
        .populate("foodPartner", "fullName")
        .lean();

      const foods = await Promise.all(
        foodItems.map(async (food: IFood) => {
          const isLiked = await likeModel.findOne({
            foodId: food._id,
            userId,
          });
          const isSaved = await saveModel.findOne({
            foodId: food._id,
            userId,
          });

          return {
            ...food,
            isLiked: !!isLiked,
            isSaved: !!isSaved,
          };
        })
      );
      return res.status(200).json({
        message: "Food items fetched successfully",
        data: foods,
      });
    } catch (error) {
      console.log("error in get food items: ", error);
      next(createHttpError(500, "failed to fetch food items"));
    }
  }

  async likeFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;
      const isAlreadyLike = await likeModel.findOne({
        foodId,
        userId: req?.user?.id,
      });

      if (isAlreadyLike) {
        // unlike
        await likeModel.deleteOne({
          userId: req?.user?._id,
          foodId: foodId,
        });
        await foodModel.findByIdAndUpdate(foodId, {
          $inc: { likesCount: -1 },
        });

        return res.status(200).json({
          message: "Food unliked successfully",
        });
      }

      const like = await likeModel.create({
        foodId,
        userId: req?.user?.id,
      });
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likesCount: 1 },
      });

      return res.status(200).json({
        message: "Food liked successfully",
        data: like,
      });
    } catch (error) {
      console.log("error liking the food", error);
      next(createHttpError(400, "error liking the food post"));
    }
  }

  async saveFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;

      const isAlreadySaved = await saveModel.findOne({
        foodId,
        userId: req?.user?.id,
      });

      if (!isAlreadySaved) {
        const save = await saveModel.create({
          foodId,
          userId: req?.user?.id,
        });
        await foodModel.findByIdAndUpdate(foodId, {
          $inc: { savesCount: 1 },
        });

        return res.status(200).json({
          message: "Food saved successfully",
          data: save,
        });
      }

      // unsave
      await saveModel.deleteOne({
        userId: req?.user?._id,
        foodId: foodId,
      });
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: -1 },
      });

      return res.status(200).json({
        message: "Food unsaved successfully",
      });
    } catch (error) {
      console.log("error liking the food", error);
      next(createHttpError(400, "error liking the food post"));
    }
  }
}
