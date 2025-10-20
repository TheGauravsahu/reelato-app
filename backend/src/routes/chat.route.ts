import express from "express";
import { chatController } from "../controllers/chat.controller";
import { authFoodPartner, authUser } from "../middlewares/auth.middleware";

const router = express.Router();

// user
router.get("/user/all", authUser, chatController.getUserChats);
router.post("/user", authUser, chatController.getOrCreatChat);
router.get("/user/:chatId/messages", authUser, chatController.getChatMessages);
router.put("/user/:chatId", authUser, chatController.updateLastMessage);

// food-partner
router.get(
  "/food-partner/all",
  authFoodPartner,
  chatController.getFoodPartnerChats
);
router.post("/food-partner", authFoodPartner, chatController.getOrCreatChat);
router.get(
  "/food-partner/:chatId/messages",
  authFoodPartner,
  chatController.getChatMessages
);
router.put(
  "/food-partner/:chatId",
  authFoodPartner,
  chatController.updateLastMessage
);

export default router;
