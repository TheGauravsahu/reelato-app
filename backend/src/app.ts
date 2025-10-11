import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route";
import foodRouter from "./routes/food.routes";
import feedRouter from "./routes/feed.route";
import playlistRouter from "./routes/playlist.route";
import { globalErrorHandler } from "./middlewares/errorHandler.middleware";
import config from "./config";
import { limiter } from "./middlewares/rateLimiter.middleware";
import { authUser } from "./middlewares/auth.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(cors({ origin: config.FRONEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use("/api/auth", authRouter);
app.use("/api/foods", foodRouter);
app.use("/api/feed", authUser, feedRouter);
app.use("/api/playlists", authUser, playlistRouter);

app.use(globalErrorHandler);

export default app;
