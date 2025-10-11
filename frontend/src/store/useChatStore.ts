import { create } from "zustand";
import { useSocketStore } from "./useSocketStore";
import type { IMessage } from "@/types";

interface ChatState {
  messages: IMessage[];
  addMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
  joinChat: (chatId: string) => void;
  sendMessage: (chatId: string, message: string) => void;
  listenForMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  addMessage: (message: IMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: IMessage[]) => set({ messages }),

  joinChat: (chatId) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.emit("joinChat", chatId);
  },

  sendMessage: (chatId: string, text: string) => {
    const { socket, user } = useSocketStore.getState();
    if (!socket || !user) return;
    socket.emit("sendMessage", { chatId, text });
  },

  listenForMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); // avoid duplicate listeners
    socket.on("newMessage", (message: IMessage) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });
  },
}));
