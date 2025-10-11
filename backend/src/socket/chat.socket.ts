import { Server, Socket } from "socket.io";
import config from "../config";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { foodPartnerModel } from "../models/foodPartner.model";
import { messageModel } from "../models/message.model";
import { chatModel } from "../models/chat.model";

interface SocketUser {
  id: string;
  role: "user" | "food_partner";
}

interface CustomSocket extends Socket {
  user?: SocketUser;
}

export default function setupChatSocket(io: Server) {
  io.on("connection", (socket: CustomSocket) => {
    console.log("🔗 New client connected");

    // authentication
    socket.on("authenticate", async (token: string) => {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as {
          id: string;
          email: string;
        };
        let user: any;
        let role: "user" | "food_partner";

        user = await userModel.findById(decoded.id);
        if (user) role = "user";
        else {
          user = await foodPartnerModel.findById(decoded.id);
          if (user) role = "food_partner";
          else throw new Error("Invalid token user.");
        }

        const socketUser: SocketUser = { id: user._id.toString(), role };
        (socket as any).user = socketUser;
        console.log(`✅ ${role} authenticated:`, user.fullName);

        // Notify client
        socket.emit("authenticated", socketUser);
      } catch (error) {
        console.error("❌Socket Authentication failed", error);
        socket.disconnect();
      }
    });

    // join chat room
    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`🔹 User ${socket.user?.id} joined chat ${chatId}`);
    });

    // send message
    socket.on("sendMessage", async (data) => {
      const { chatId, text } = data;
      const sender = socket.user as SocketUser;
      if (!sender) return;

      const message = await messageModel.create({
        chatId,
        text,
        senderType: sender.role,
        senderId: sender.id,
      });

      await chatModel.findByIdAndUpdate(chatId, {
        lastMessage: text,
        lastMessageAt: new Date(),
      });

      // notify all clients in the chat room
      io.to(chatId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });
}
