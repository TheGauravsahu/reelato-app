import express from "express";
import { FoodController } from "../controllers/food.controller";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware";
import { uplaod } from "../middlewares/multer.middelware";

const router = express.Router();
const foodController = new FoodController();

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

export default router;
