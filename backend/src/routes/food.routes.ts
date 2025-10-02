import express from "express";
import { foodController } from "../controllers/food.controller";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware";
import { uplaod } from "../middlewares/multer.middelware";
import { watchController } from "../controllers/watch.controller";

const router = express.Router();

router.post(
  "/",
  authFoodPartner as any,
  uplaod.single("video"),
  foodController.createFood.bind(foodController) as any
);

router.get(
  "/",
  authUser as any,
  foodController.getFoodItems.bind(foodController) as any
);

router.get(
  "/food-partner/:id",
  authUser as any,
  foodController.getPartnerFoods.bind(foodController) as any
);

router.post(
  "/:foodId/like",
  authUser as any,
  foodController.likeFood.bind(foodController) as any
);

router.post(
  "/:foodId/save",
  authUser as any,
  foodController.saveFood.bind(foodController) as any
);

router.post(
  "/:foodId/watch",
  authUser as any,
  watchController.watchFood.bind(watchController) as any
);

export default router;
