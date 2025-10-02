import mongoose from "mongoose";

interface IWatch extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  foodId: mongoose.Schema.Types.ObjectId;
  watchedAt: Date;
}

const watchSchema = new mongoose.Schema<IWatch>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods",
      required: true,
    },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const watchModel = mongoose.model<IWatch>("watched_videos", watchSchema);
