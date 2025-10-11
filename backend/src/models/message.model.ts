import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderType: "user" | "food_partner";
  text: string;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model<IMessage>("messages", messageSchema);
