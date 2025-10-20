import { io, Socket } from "socket.io-client";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useFoodPartnerAuthStore } from "@/hooks/useFoodPartnerAuthStore";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket> => {
  if (socket) return socket;

  const userToken = useUserAuthStore.getState().token;
  const partnerToken = useFoodPartnerAuthStore.getState().token;
  const token = userToken || partnerToken;

  if (!token) {
    console.warn("⚠️ No token found, cannot connect socket");
    throw new Error("Token missing");
  }

  const socketInstance = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
  });

  socketInstance.on("connect", () => {
    console.log("✅ Socket connected:", socketInstance.id);
    socketInstance.emit("authenticate", token);
  });

  socket = socketInstance;
  return socketInstance;
};

export const getSocket = () => socket;
