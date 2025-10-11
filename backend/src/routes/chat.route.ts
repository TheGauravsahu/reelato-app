import express from "express";
import { chatController } from "../controllers/chat.controller";
import { authUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authUser, chatController.getOrCreatChat);
router.get("/:chatId/messages", authUser, chatController.getChatMessages);
router.put("/:chatId", authUser, chatController.updateLastMessage);
router.get("/user", authUser, chatController.getUserChats);
router.get("/food-partner", chatController.getFoodPartnerChats);

export default router;
