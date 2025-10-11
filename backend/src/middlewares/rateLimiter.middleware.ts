import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import config from "../config";

export const limiter = rateLimit({
  skip: (req, res) => {
    return config.NODE_ENV !== "production";
  },
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later.",
      error: "Too many requests, please try again later.",
    });
  },
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"] as string | undefined;
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;
    return ip || "unknown";
  },
});
