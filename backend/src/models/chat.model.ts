import mongoose from "mongoose";

export interface IChat extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  foodPartnerId: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    foodPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food_partners",
      required: true,
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const chatModel = mongoose.model<IChat>("chats", chatSchema);
