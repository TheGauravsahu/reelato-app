import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { watchModel } from "../models/watch.model";

class WatchController {
  async watchFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;
      const userId = req?.user?._id;

      const alreadyWatched = await watchModel.findOne({ foodId, userId });
      if (!alreadyWatched) {
        await watchModel.create({ foodId, userId, isVisible: true }); // first time watching
      } else {
        alreadyWatched.isVisible = true;
        alreadyWatched.watchedAt = new Date();
        await alreadyWatched.save();
      }

      return res.status(201).json({
        message: "Marked video as watched.",
      });
    } catch (error) {
      next(createHttpError(400, "failed to mark video as watched."));
      console.log("Error marking video as watched: ", error);
    }
  }

  async getWatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const history = await watchModel
        .find({ userId, isVisible: true })
        .populate({
          path: "foodId",
          populate: {
            path: "foodPartner",
            select: "fullName _id",
          },
        })
        .sort({ watchedAt: -1 });

      return res.status(200).json({
        message: "Watched History fetched successfully.",
        data: history,
      });
    } catch (error) {
      next(createHttpError(400, "failed to fetch watched history."));
      console.log("Error fetching watched history: ", error);
    }
  }

  async deleteAllHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      await watchModel.updateMany({ userId }, { $set: { isVisible: false } });

      return res.status(200).json({
        message: "Watch history cleared.",
      });
    } catch (error) {
      console.log("error deleting all watch history: ", error);
      next(createHttpError(400, "failed to delete watch history"));
    }
  }

  async deleteHistoryItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;
      const userId = req?.user?._id;

      await watchModel.updateOne(
        { userId, foodId },
        { $set: { isVisible: false } }
      );

      return res.status(200).json({
        message: "Watch history deleted.",
      });
    } catch (error) {
      next(createHttpError(400, "failed to delete history item."));
      console.log("Error deleting history item: ", error);
    }
  }
}

export const watchController = new WatchController();
