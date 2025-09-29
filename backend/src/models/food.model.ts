import mongoose from "mongoose";

export interface IFood  extends mongoose.Document {
  name: string;
  videoUrl: string;
  description: string;
  foodPartner: mongoose.Schema.Types.ObjectId;
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
  },
  { timestamps: true }
);

export const foodModel = mongoose.model<IFood>("foods", foodSchema);
