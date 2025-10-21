import express from "express";
import { foodController } from "../controllers/food.controller";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middelware";
import { watchController } from "../controllers/watch.controller";

const router = express.Router();

router.post(
  "/",
  authFoodPartner as any,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  foodController.createFood.bind(foodController) as any
);

router.get(
  "/my",
  authFoodPartner as any,
  foodController.getMyFoods.bind(foodController) as any
);

router.get(
  "/:foodId",
  authFoodPartner as any,
  foodController.getFoodDetails.bind(foodController) as any
);

router.put(
  "/:foodId",
  authFoodPartner as any,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  foodController.updateFood.bind(foodController) as any
);

router.delete(
  "/:foodId",
  authFoodPartner as any,
  foodController.deleteFood.bind(foodController) as any
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
