import { Request, NextFunction, Response, response } from "express";
import { foodService } from "../services/food.service";
import { asyncHandler } from "../utils/asyncHandler";

class FoodController {
  createFood = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const videoFile = files?.["video"]?.[0];
    const thumbnailFile = files?.["thumbnail"]?.[0];

    const data = await foodService.createFood(
      req.body,
      videoFile,
      thumbnailFile,
      req?.foodPartner?._id as string
    );
    return res.status(201).json({
      message: "Food created successfully",
      data,
    });
  };

  getFoodItems = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await foodService.getFoodItems(req?.user?._id as string);
      if (!data.length) {
        return res.status(200).json({
          message: "No foods found.",
          data: [],
        });
      }

      return res.status(200).json({
        message: "Food items fetched successfully",
        data,
      });
    }
  );

  likeFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = foodService.likeFood(
        req.params.foodId,
        req?.user?._id as string
      );
      return res.status(200).json(response);
    }
  );

  saveFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = foodService.likeFood(
        req.params.foodId,
        req?.user?._id as string
      );
      return res.status(200).json(response);
    }
  );

  getSavedFoods = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.getSavedFoods(req?.user?._id as string);
      return res.status(200).json(response);
    }
  );

  getPartnerFoods = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.getPartnerFoods(
        req.params.id,
        req?.user?._id as string
      );
      res.status(200).json(response);
    }
  );

  getMyFoods = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.getMyFoods(
        req?.foodPartner?._id as string
      );
      res.status(200).json(response);
    }
  );

  getLikedFoods = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.getLikedFoods(
        req?.user?._id as string
      );
      return res.status(200).json(response);
    }
  );

  deleteFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.deleteFood(req.params.foodId);
      return res.status(200).json(response);
    }
  );

  updateFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const videoFile = files?.["video"]?.[0];
      const thumbnailFile = files?.["thumbnail"]?.[0];

      const response = await foodService.updateFood(
        req.params.foodId,
        req.body,
        videoFile,
        thumbnailFile
      );
      return res.status(200).json(response);
    }
  );

  getFoodDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await foodService.getFoodDetails(req.params.foodId);
      return res.status(200).json(response);
    }
  );
}

export const foodController = new FoodController();
