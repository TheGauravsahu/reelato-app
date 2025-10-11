import { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service";
import createHttpError from "http-errors";

class ChatController {
  async getOrCreatChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodPartnerId } = req.body;
      const userId = req?.user?.id as string;
      
      const chat = await chatService.getOrCreateChat(userId, foodPartnerId);
      res
        .status(200)
        .json({ message: "Chat created or fetched successfully", data: chat });
    } catch (error) {
      console.log("errror in getOrCreatChat controller", error);
      next(createHttpError(400, "failed to get or create chat messages"));
    }
  }

  async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const messages = await chatService.getChatMessages(chatId);
      res.status(200).json({
        message: "Chat messages fetched successfully",
        data: messages,
      });
    } catch (error) {
      console.log("error in getChatMessages controller", error);
      next(createHttpError(400, "failed to get chat messages"));
    }
  }

  async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?._id as string;
      const chats = await chatService.getUserChats(userId);
      res.status(200).json({
        message: "User chats fetched successfully",
        data: chats,
      });
    } catch (error) {
      console.log("error in getUserChats controller", error);
      next(createHttpError(400, "failed to get user chats"));
    }
  }

  async getFoodPartnerChats(req: Request, res: Response, next: NextFunction) {
    try {
      const foodPartnerId = req?.foodPartner?._id as string;
      const chats = await chatService.getFoodPartnerChats(foodPartnerId);
      res.status(200).json({
        message: "Food partner chats fetched successfully",
        data: chats,
      });
    } catch (error) {
      console.log("error in getFoodPartnerChats controller", error);
      next(createHttpError(400, "failed to get food partner chats"));
    }
  }

  async updateLastMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const { message } = req.body;
      await chatService.updateLastMessage(chatId, message);
      res.status(200).json({
        message: "Last message updated successfully",
      });
    } catch (error) {
      console.log("error in updateLastMessage controller", error);
      next(createHttpError(400, "failed to update last message"));
    }
  }
}

export const chatController = new ChatController();
