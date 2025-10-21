import createHttpError from "http-errors";
import { foodModel, IFood } from "../models/food.model";
import { uploadFile } from "./storage.service";
import { v4 as uuid } from "uuid";
import { likeModel } from "../models/like.model";
import { saveModel } from "../models/save.model";
import { watchModel } from "../models/watch.model";

class FoodService {
  async createFood(
    { name, description }: Partial<IFood>,
    videoFile: Express.Multer.File | undefined,
    thumbnailFile: Express.Multer.File | undefined,
    foodPartnerId: string
  ) {
    if (!videoFile) {
      throw createHttpError(400, "No file uploaded");
    }
    if (!name || !description) {
      throw createHttpError(400, "Missing required fields");
    }

    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadFile(videoFile, `vid_${uuid()}`),
      thumbnailFile ? uploadFile(thumbnailFile, `thum_${uuid()}`) : null,
    ]);

    return await foodModel.create({
      name,
      description,
      videoUrl,
      thumbnailUrl,
      foodPartner: foodPartnerId,
    });
  }

  async getFoodItems(userId: string) {
    const foodItems = await foodModel
      .find()
      .populate("foodPartner", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    if (!foodItems.length) return [];

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

    return foods;
  }

  async likeFood(foodId: string, userId: string) {
    const isAlreadyLike = await likeModel.findOne({ foodId, userId });

    if (isAlreadyLike) {
      // unlike
      await likeModel.deleteOne({ userId, foodId });
      await foodModel.updateOne(
        { _id: foodId, likesCount: { $gt: 0 } },
        { $inc: { likesCount: -1 } }
      );

      return {
        message: "Food unliked successfully",
      };
    }
    const like = await likeModel.create({ foodId, userId });
    await foodModel.updateOne({ _id: foodId }, { $inc: { likesCount: 1 } });

    return {
      message: "Food liked successfully",
      data: like,
    };
  }

  async saveFood(foodId: string, userId: string) {
    const isAlreadySaved = await saveModel.findOne({ foodId, userId });
    if (isAlreadySaved) {
      // unsave
      await saveModel.deleteOne({ userId, foodId });
      await foodModel.updateOne(
        { _id: foodId, savesCount: { $gt: 0 } }, // prevent negative
        { $inc: { savesCount: -1 } }
      );
      return {
        message: "Food unsaved successfully",
      };
    }
    const save = await saveModel.create({ foodId, userId });
    await foodModel.updateOne({ _id: foodId }, { $inc: { savesCount: 1 } });

    return {
      message: "Food saved successfully",
      data: save,
    };
  }

  async getSavedFoods(userId: string) {
    const savedFoods = await saveModel
      .find({
        userId,
      })
      .populate({
        path: "foodId",
        populate: { path: "foodPartner", select: "fullName _id" },
      });
    if (!savedFoods || savedFoods.length === 0) {
      return {
        message: "No saved foods found",
        data: [],
      };
    }
    return {
      message: "Saved foods retrieved successfully",
      data: savedFoods,
    };
  }

  async getPartnerFoods(id: string, userId: string) {
    const foodItems = await foodModel
      .find({ foodPartner: id })
      .populate("foodPartner", "fullName phone address")
      .lean();

    // console.log(foodItems)

    if (!foodItems.length) {
      return {
        message: "No foods found for this partner",
        data: [],
      };
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

    return {
      message: "Food partner foods retrieved successfully",
      data: foods,
    };
  }

  async getMyFoods(id: string) {
    const foods = await foodModel
      .find({ foodPartner: id })
      .sort({ createdAt: -1 });
    return {
      message: "Foods retrieved successfully",
      data: foods,
    };
  }

  async getLikedFoods(userId: string) {
    const likedFoods = await likeModel
      .find({
        userId,
      })
      .populate({
        path: "foodId",
        populate: { path: "foodPartner", select: "fullName _id" },
      });
    if (!likedFoods || likedFoods.length === 0) {
      return { message: "No liked foods found", data: [] };
    }
    return {
      message: "Liked foods retrieved successfully",
      data: likedFoods,
    };
  }

  async deleteFood(foodId: string) {
    const food = await foodModel.findById(foodId);
    if (!food) {
      throw createHttpError(404, "Food not found");
    }
    await foodModel.findByIdAndDelete(foodId);
    return {
      message: "Food deleted successfully.",
    };
  }

  async updateFood(
    foodId: string,
    data: Partial<IFood>,
    videoFile?: Express.Multer.File,
    thumbnailFile?: Express.Multer.File
  ) {
    const food = await foodModel.findById(foodId);
    if (!food) {
      throw createHttpError(404, "Food not found");
    }

    // upload files
    let videoUrl: string | undefined;
    let thumbnailUrl: string | undefined;
    if (videoFile) {
      videoUrl = await uploadFile(videoFile, `vid_${uuid()}`);
    }
    if (thumbnailFile) {
      thumbnailUrl = await uploadFile(thumbnailFile, `thumb_${uuid()}`);
    }

    // upate data
    const update: Partial<IFood> = {
      ...data,
      ...(videoUrl && { videoUrl }),
      ...(thumbnailUrl && { thumbnailUrl }),
    };
    const updatedFood = await foodModel.findByIdAndUpdate(foodId, update, {
      new: true,
    });
    return {
      message: "Food updated successfully.",
      data: updatedFood,
    };
  }

  async getFoodDetails(foodId: string) {
    const food = await foodModel.findById(foodId);
    if (!food) {
      throw createHttpError(404, "Food not found");
    }
    return {
      message: "Food retrived succesfully.",
      data: food,
    };
  }
}

export const foodService = new FoodService();
