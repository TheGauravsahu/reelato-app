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
        await watchModel.create({ foodId, userId });
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
        .find({ userId })
        .populate("foodId")
        .sort({ watched: -1 });

      return res.status(200).json({
        message: "Watched History fetched successfully.",
        data: history,
      });
    } catch (error) {
      next(createHttpError(400, "failed to fetch watched history."));
      console.log("Error fetching watched history: ", error);
    }
  }
}

export const watchController = new WatchController();
