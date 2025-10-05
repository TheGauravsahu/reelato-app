import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { IPlaylist, playlistModel } from "../models/playlist.model";
import mongoose from "mongoose";

class PlaylistController {
  async createPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const { title }: Partial<IPlaylist> = req.body;
      const userId = req?.user?._id;

      if (!title) {
        return next(createHttpError(400, "Title are required"));
      }

      const playlist = await playlistModel.create({
        title,
        foodIds: [],
        userId,
      });
      return res.status(201).json({
        message: "Playlist created successfully",
        data: playlist,
      });
    } catch (error) {
      next(createHttpError(400, "falied to create playlist"));
      console.log("error creating playlist", error);
    }
  }

  async getUserAllPlaylists(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const playlists = await playlistModel
        .find({ userId, isVisible: true })
        .populate("foodIds")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "User playlists fetched successfully",
        data: playlists,
      });
    } catch (error) {
      next(createHttpError(400, "falied to fetch all user playlists"));
      console.log("error fetching user all playlists", error);
    }
  }

  async getUserPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const playlistId = req.params.playlistId;
      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        return next(createHttpError(400, "Invalid playlist ID"));
      }

      const playlist = await playlistModel
        .findOne({ _id: playlistId, userId, isVisible: true })
        .populate({
          path: "foodIds",
          populate: { path: "foodPartner", select: "fullName" },
        })
        .lean();
      if (!playlist) {
        return next(createHttpError(404, "Playlist not found"));
      }

      return res.status(200).json({
        message: "User playlist fetched successfully",
        data: playlist,
      });
    } catch (error) {
      next(createHttpError(400, "falied to user playlist"));
      console.log("error fetching user playlist", error);
    }
  }

  async addFoodToPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const playlistId = req.params.playlistId;
      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        return next(createHttpError(400, "Invalid playlist ID"));
      }

      const { foodId } = req.body;

      if (!playlistId || !foodId) {
        return next(createHttpError(400, "playlistId and foodId are required"));
      }

      const playlist = await playlistModel.findOne({
        _id: playlistId,
        userId,
        isVisible: true,
      });
      if (!playlist) {
        return next(createHttpError(404, "Playlist not found"));
      }

      if (playlist.foodIds.includes(foodId)) {
        return next(createHttpError(400, "Food already in playlist"));
      }

      playlist.foodIds.push(foodId);
      await playlist.save();

      return res.status(200).json({
        message: "Food added to playlist successfully",
        data: playlist,
      });
    } catch (error) {
      next(createHttpError(400, "falied to add food to playlist"));
      console.log("error adding food to playlist", error);
    }
  }

  async editPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const { playlistId } = req.params;
      const { title }: Partial<IPlaylist> = req.body;
      const userId = req?.user?._id;

      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        return next(createHttpError(400, "Invalid playlist ID"));
      }

      const playlist = await playlistModel.findOneAndUpdate(
        { _id: playlistId, userId, isVisible: true },
        { title },
        { new: true }
      );
      if (!playlist) {
        return next(createHttpError(404, "Playlist not found"));
      }
      return res.status(200).json({
        message: "Playlist edited successfully",
        data: playlist,
      });
    } catch (error) {
      console.log("error editing playlist", error);
      next(createHttpError(400, "falied to edit playlist"));
    }
  }

  async deletePlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id;
      const { playlistId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        return next(createHttpError(400, "Invalid playlist ID"));
      }

      const playlist = await playlistModel.findOneAndUpdate(
        { _id: playlistId, userId, isVisible: true },
        { isVisible: false },
        { new: true }
      );

      if (!playlist) {
        return next(createHttpError(404, "Playlist not found"));
      }

      return res.status(200).json({
        success: true,
        message: "Playlist deleted successfully",
      });
    } catch (error) {
      next(createHttpError(400, "falied to delete playlist"));
      console.log("error deleting playlist", error);
    }
  }
}

export const playlistController = new PlaylistController();
