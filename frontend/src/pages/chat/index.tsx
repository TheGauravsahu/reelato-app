import Loader from "@/components/general/Loader";
import { Button } from "@/components/ui/button";
import { useChatMessages } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
import type { IMessage } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const {
    messages,
    sendMessage,
    addMessage,
    joinChat,
    listenForMessages,
    setMessages,
  } = useChatStore();
  const { user, connect } = useSocketStore();
  const [text, setText] = useState("");
  const { data: fetchedMessages, isPending } = useChatMessages(chatId!);

  useEffect(() => {
    if (fetchedMessages) setMessages(fetchedMessages);
  }, [fetchedMessages, setMessages]);

  useEffect(() => {
    if (!chatId) return;
    const initSocket = async () => {
      await connect();

      const { socket } = useSocketStore.getState();
      if (!socket) return;

      socket.on("authenticated", () => {
        console.log("✅ Authenticated, joining chat:", chatId);
        joinChat(chatId);
        listenForMessages();
      });
    };

    initSocket();
    return () => {
      const { socket } = useSocketStore.getState();
      socket?.off("newMessage");
      socket?.off("authenticated");
    };
  }, [chatId, connect, joinChat, listenForMessages]);

  const handleSend = () => {
    if (text.trim()) {
      const newMessage = {
        text,
        chatId,
        senderId: user?.id as string,
        createdAt: new Date().toISOString(),
      };
      addMessage(newMessage as IMessage); // instantly show it
      sendMessage(chatId!, text);
      setText("");
    }
  };

  if (isPending) return <Loader />;

  return (
    <div className="h-full w-full">
      <div className="h-screen md:h-[90%] w-full overflow-y-scroll scroll-hide p-4 space-y-4 flex flex-col  items-end ">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex max-w-sm rounded-sm   min-h-10 ${
              msg.senderId === user?.id
                ? "justify-end bg-primary"
                : "justify-start bg-secondary"
            }`}
          >
            <div className="flex-1 w-[90%] items-center justify-center px-4 py-2">
              <h4>{msg.text}</h4>
            </div>
            <div className="text-[12px]   min-h-10 flex items-end justify-end pr-2 pb-1 ">
              {formatDate(msg.createdAt)}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4  flex gap-2 fixed bottom-0 right-0 bg-background z-10 w-full md:w-[60vw]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPage;
