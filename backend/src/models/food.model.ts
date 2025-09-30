import mongoose from "mongoose";

export interface IFood extends mongoose.Document {
  name: string;
  videoUrl: string;
  description: string;
  foodPartner: mongoose.Schema.Types.ObjectId;
  likesCount: number;
  savesCount: number;
}

const foodSchema = new mongoose.Schema<IFood>(
  {
    name: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food_partners",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const foodModel = mongoose.model<IFood>("foods", foodSchema);
