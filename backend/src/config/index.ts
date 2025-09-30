import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost:27017/reelato_db",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "",
  FRONEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
