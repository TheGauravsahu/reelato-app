import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import config from "../config";

export const limiter = rateLimit({
  skip: (req, res) => {
    return config.NODE_ENV !== "production";
  },
  windowMs: 15 * 60 * 1000,
  max: 50,
  handler: (req, res) => {
    return res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later.",
      error: "Too many requests, please try again later.",
    });
  },
  keyGenerator: (req, res) => {
    return ipKeyGenerator(req.ip || "unknown");
  },
});
