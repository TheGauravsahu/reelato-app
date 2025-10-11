import { create } from "zustand";
import { connectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";

interface SocketUser {
  id: string;
  role: "user" | "food_partner";
}

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  user?: SocketUser;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  user: undefined,

  connect: async () => {
    const socket = await connectSocket();

    socket.on("authenticated", (user: SocketUser) => {
      console.log("✅ Authenticated as:", user);
      set({ user, isConnected: true, socket });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false, socket: null });
    });
  },

  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null, isConnected: false, user: undefined };
    });
  },
}));
