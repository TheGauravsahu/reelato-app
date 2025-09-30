import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware";

const router = express.Router();
const authController = new AuthController();

// users authentication
router.post(
  "/users/register",
  authController.registerUser.bind(authController)
);
router.post("/users/login", authController.loginUser.bind(authController));
router.post("/users/logout", authController.logoutUser.bind(authController));
router.get(
  "/users/me",
  authUser,
  authController.getUserProfile.bind(authController)
);
router.put(
  "/users/me",
  authUser,
  authController.updateUser.bind(authController)
);
router.delete(
  "/users/me",
  authUser,
  authController.deleteUser.bind(authController)
);

// food partners authentication
router.post(
  "/food-partners/register",
  authController.registerFoodPartner.bind(authController)
);
router.post(
  "/food-partners/login",
  authController.loginFoodPartner.bind(authController)
);
router.post(
  "/food-partners/logout",
  authController.logoutFoodPartner.bind(authController)
);
router.get(
  "/food-partners/me",
  authFoodPartner,
  authController.getFoodPartnerProfile.bind(authController)
);

export default router;
