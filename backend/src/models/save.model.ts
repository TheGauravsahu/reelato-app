import mongoose from "mongoose";

export interface ISave extends mongoose.Schema {
  foodId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

const saveSchema = new mongoose.Schema<ISave>(
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

export const saveModel = mongoose.model<ISave>("saved_foods", saveSchema);
