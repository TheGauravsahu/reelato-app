import { chatModel } from "../models/chat.model";
import { messageModel } from "../models/message.model";

class ChatService {
  async getOrCreateChat(userId: string, foodPartnerId: string) {
    let chat = await chatModel.findOne({
      userId,
      foodPartnerId,
    });
    if (!chat) {
      chat = await chatModel.create({
        userId,
        foodPartnerId,
      });
    }
    return chat;
  }

  async getChatMessages(chatId: string) {
    return await messageModel.find({ chatId }).sort({ createdAt: 1 });
  }

  async updateLastMessage(chatId: string, message: string) {
    return await chatModel.findByIdAndUpdate(chatId, {
      lastMessage: message,
      lastMessageAt: new Date(),
    });
  }

  async getUserChats(userId: string) {
    return await chatModel
      .find({ userId })
      .populate("foodPartnerId", "fullName")
      .sort({ lastMessageAt: -1 });
  }

  async getFoodPartnerChats(foodPartnerId: string) {
    return await chatModel
      .find({ foodPartnerId })
      .populate("userId", "fullName")
      .sort({ lastMessageAt: -1 });
  }

  async getChatById(chatId: string) {
    return await chatModel.findById(chatId);
  }
}

export const chatService = new ChatService();
