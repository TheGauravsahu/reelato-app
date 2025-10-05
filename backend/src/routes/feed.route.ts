import express from "express";
import { authUser } from "../middlewares/auth.middleware";
import { watchController } from "../controllers/watch.controller";
import { foodController } from "../controllers/food.controller";

const router = express.Router();

router.get(
  "/watch-history",
  watchController.getWatchHistory.bind(watchController)
);
router.delete(
  "/watch-history",
  watchController.deleteAllHistory.bind(watchController)
);
router.delete(
  "/watch-history/:foodId",
  watchController.deleteHistoryItem.bind(watchController)
);

router.get("/saved", foodController.getSavedFoods.bind(foodController));
router.get("/liked", foodController.getLikedFoods.bind(foodController));

export default router;
