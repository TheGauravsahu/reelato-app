import mongoose from "mongoose";
import config from ".";

export default async function connectDB() {
  try {
    await mongoose.connect(config.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
