import mongoose from "mongoose";

export interface IPlaylist extends mongoose.Document {
  title: string;
  userId: mongoose.Schema.Types.ObjectId;
  foodIds: mongoose.Schema.Types.ObjectId[];
  isVisible: boolean;
}

const playlistSchema = new mongoose.Schema<IPlaylist>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    foodIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
        required: true,
      },
    ],

    isVisible: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

export const playlistModel = mongoose.model<IPlaylist>(
  "playlists",
  playlistSchema
);
