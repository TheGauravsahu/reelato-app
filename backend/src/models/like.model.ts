import mongoose from "mongoose";

export interface ILike extends mongoose.Schema {
  foodId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

const likeSchema = new mongoose.Schema<ILike>(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const likeModel = mongoose.model<ILike>("likes", likeSchema);
