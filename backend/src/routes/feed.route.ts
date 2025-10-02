import express from "express";
import { authUser } from "../middlewares/auth.middleware";
import { watchController } from "../controllers/watch.controller";

const router = express.Router();

router.get(
  "/watch-history",
  authUser,
  watchController.getWatchHistory.bind(watchController)
);
router.delete(
  "/watch-history",
  authUser,
  watchController.deleteAllHistory.bind(watchController)
);
router.delete(
  "/watch-history/:foodId",
  authUser,
  watchController.deleteHistoryItem.bind(watchController)
);

export default router;
