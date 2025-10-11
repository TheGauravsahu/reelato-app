import { io, Socket } from "socket.io-client";
import { useUserAuthStore } from "@/store/useUserAuthStore";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  if (socket) return socket;

  const { token } = useUserAuthStore.getState();

  const socketInstance = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  socketInstance.on("connect", () => {
    console.log("✅ Socket connected:", socketInstance.id);
    socketInstance.emit("authenticate", token);
  });

  socketInstance.connect();
  socket = socketInstance;
  return socketInstance;
};
