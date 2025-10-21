import Loader from "@/components/general/Loader";
import { Button } from "@/components/ui/button";
import { useFoodPartnerChatMessages } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
import type { IMessage } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const FoodPartnerChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, sendMessage, addMessage, setMessages } = useChatStore();
  const { user, connect } = useSocketStore();
  const [text, setText] = useState("");
  const { data: fetchedMessages, isPending } = useFoodPartnerChatMessages(
    chatId!
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchedMessages) setMessages(fetchedMessages);
  }, [fetchedMessages, setMessages]);

  useEffect(() => {
    if (!chatId) return;
    const setupSocket = async () => {
      await connect(); // connect socket
      const { socket } = useSocketStore.getState();
      if (!socket) return;

      // Remove old listeners to prevent duplicates
      socket.off("authenticated");
      socket.off("newMessage");

      // When socket authenticates
      socket.on("authenticated", () => {
        // console.log("✅ Socket authenticated");

        // Join chat
        socket.emit("joinChat", chatId);

        // Listen for new messages
        socket.on("newMessage", (message: IMessage) => {
          addMessage(message);
        });
      });

      // If already connected and authenticated
      if (socket.connected && user) {
        socket.emit("joinChat", chatId);
        socket.on("newMessage", (message: IMessage) => {
          addMessage(message);
        });
      }
    };

    setupSocket();

    // Cleanup on unmount
    return () => {
      const { socket } = useSocketStore.getState();
      socket?.off("authenticated");
      socket?.off("newMessage");
    };
  }, [chatId, addMessage, connect, user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(chatId!, text);
      setText("");
    }
  };

  if (isPending || !user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full pt-4 pb-12 ">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hide  scroll-hide flex flex-col  items-end ">
        {messages.map((msg) => {
          const isSender = msg.senderId === user?.id;
          return (
            <div
              key={msg._id || msg.createdAt}
              className={`flex w-full ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-sm rounded-sm min-h-10 ${
                  isSender ? "bg-primary" : "bg-secondary"
                }`}
              >
                <div className="flex-1 w-[90%] items-center justify-center px-4 py-2">
                  <h4>{msg.text}</h4>
                </div>
                <div className="text-[12px]   min-h-10 flex items-end justify-end pr-2 pb-1 ">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 p-3  bg-background fixed bottom-0 right-0 w-full md:w-[60vw]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
              setText("");
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default FoodPartnerChatPage;
