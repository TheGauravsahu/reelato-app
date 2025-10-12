import { Request, NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { foodModel, IFood } from "../models/food.model";
import { v4 as uuid } from "uuid";
import { uploadFile } from "../services/storage.service";
import { likeModel } from "../models/like.model";
import { saveModel } from "../models/save.model";
import { watchModel } from "../models/watch.model";
import mongoose from "mongoose";

class FoodController {
  constructor() {}

  async createFood(req: Request, res: Response, next: NextFunction) {
    // console.log(req);
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

      if (!foodItems.length) {
        return res.status(200).json({
          message: "No foods found.",
          data: [],
        });
      }

      const [likes, saves, watched] = await Promise.all([
        likeModel
          .find({ userId, foodId: { $in: foodItems.map((f) => f._id) } })
          .lean(),
        saveModel
          .find({ userId, foodId: { $in: foodItems.map((f) => f._id) } })
          .lean(),
        watchModel
          .find({
            userId,
            foodId: { $in: foodItems.map((f) => f._id) },
            isVisible: true,
          })
          .lean(),
      ]);

      const likedSet = new Set(likes.map((l) => String(l.foodId)));
      const savedSet = new Set(saves.map((s) => String(s.foodId)));
      const watchedSet = new Set(watched.map((w) => String(w.foodId)));

      const foods = foodItems
        .filter((f) => !watchedSet.has(String(f._id)))
        .map((food) => ({
          ...food,
          isLiked: likedSet.has(String(food._id)),
          isSaved: savedSet.has(String(food._id)),
        }));

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
      const userId = req?.user?._id as string;

      const isAlreadyLike = await likeModel.findOne({ foodId, userId });

      if (isAlreadyLike) {
        // unlike
        await likeModel.deleteOne({ userId, foodId });
        await foodModel.updateOne(
          { _id: foodId, likesCount: { $gt: 0 } },
          { $inc: { likesCount: -1 } }
        );

        return res.status(200).json({
          message: "Food unliked successfully",
        });
      }
      const like = await likeModel.create({ foodId, userId });
      await foodModel.updateOne({ _id: foodId }, { $inc: { likesCount: 1 } });

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
      const userId = req?.user?._id as string;
      
      const isAlreadySaved = await saveModel.findOne({ foodId, userId });
      if (isAlreadySaved) {
        // unsave
        await saveModel.deleteOne({ userId, foodId });
        await foodModel.updateOne(
          { _id: foodId, savesCount: { $gt: 0 } }, // prevent negative
          { $inc: { savesCount: -1 } }
        );
        return res.status(200).json({
          message: "Food unsaved successfully",
        });
      }
      const save = await saveModel.create({ foodId, userId });
      await foodModel.updateOne({ _id: foodId }, { $inc: { savesCount: 1 } });

      return res.status(200).json({
        message: "Food saved successfully",
        data: save,
      });
    } catch (error) {
      console.log("error liking the food", error);
      next(createHttpError(400, "error liking the food post"));
    }
  }

  async getSavedFoods(req: Request, res: Response, next: NextFunction) {
    const userId = req?.user?._id;
    try {
      const savedFoods = await saveModel
        .find({
          userId,
        })
        .populate({
          path: "foodId",
          populate: { path: "foodPartner", select: "fullName _id" },
        });
      if (!savedFoods || savedFoods.length === 0) {
        return res
          .status(200)
          .json({ message: "No saved foods found", data: [] });
      }
      return res.status(200).json({
        message: "Saved foods retrieved successfully",
        data: savedFoods,
      });
    } catch (error) {
      console.log("error fetching saved foods.");
      next(createHttpError(400, "failed to fetch saved food."));
    }
  }

  async getPartnerFoods(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req?.user?._id;

    try {
      const foodItems = await foodModel
        .find({ foodPartner: id })
        .populate("foodPartner", "fullName phone address")
        .lean();

      // console.log(foodItems)

      if (!foodItems.length) {
        return res.status(200).json({
          message: "No foods found for this partner",
          data: [],
        });
      }

      const [likes, saves] = await Promise.all([
        likeModel
          .find({ userId, foodId: { $in: foodItems.map((f) => f._id) } })
          .lean(),
        saveModel
          .find({ userId, foodId: { $in: foodItems.map((f) => f._id) } })
          .lean(),
      ]);

      const likedSet = new Set(likes.map((l) => String(l.foodId)));
      const savedSet = new Set(saves.map((s) => String(s.foodId)));

      const foods = foodItems.map((food) => ({
        ...food,
        isLiked: likedSet.has(String(food._id)),
        isSaved: savedSet.has(String(food._id)),
      }));

      res.status(200).json({
        message: "Food partner foods retrieved successfully",
        data: foods,
      });
    } catch (error) {
      console.log("error fetching foods items of food partner", error);
      next(createHttpError(400, "Failed to fetch foods of food partner."));
    }
  }

  async getLikedFoods(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const likedFoods = await likeModel
        .find({
          userId,
        })
        .populate({
          path: "foodId",
          populate: { path: "foodPartner", select: "fullName _id" },
        });
      if (!likedFoods || likedFoods.length === 0) {
        return res
          .status(200)
          .json({ message: "No liked foods found", data: [] });
      }
      return res.status(200).json({
        message: "Liked foods retrieved successfully",
        data: likedFoods,
      });
    } catch (error) {
      console.log("error fetching liked foods.");
      next(createHttpError(400, "failed to fetch liked food."));
    }
  }
}

export const foodController = new FoodController();
