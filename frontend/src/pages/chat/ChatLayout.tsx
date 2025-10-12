import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserChats } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";

import {} from "@radix-ui/react-avatar";
import { Link, Outlet } from "react-router-dom";

const ChatLayout = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ChatSidebar />
      <div className="md:w-[60vw] w-full pt-12 md:p-0 relative flex flex-col justify-between h-screen ">
        <Outlet />
      </div>
    </div>
  );
};

const ChatSidebar = () => {
  const { data: chats } = useUserChats();

  return (
    <div className="w-[20vw] hidden md:block h-screen border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      <div className="flex flex-col items-center gap-4 p-4">
        {chats?.map((chat) => (
          <Link
            to={`/chat/${chat._id}`}
            key={chat._id}
            className="w-full cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full bg-secondary">
                <AvatarFallback className="rounded-full">
                  {chat.foodPartnerId.fullName
                    .trimStart()
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <h2>{chat.foodPartnerId.fullName}</h2>
                <h4 className="font-light text-sm text-muted-foreground max-w-xs">
                  {chat.lastMessage?.slice(0, 17)}....
                </h4>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(chat.lastMessageAt as Date)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatLayout;
