import app from "./app";
import connectDB from "./config/db";
import { createServer } from "http";
import { Server } from "socket.io";
import setupChatSocket from "./socket/chat.socket";
import config from "./config";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.FRONTEND_URL,
    credentials: true,
  },
});

setupChatSocket(io);

async function startServer() {
  try {
    await connectDB(); // connect first

    httpServer.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
