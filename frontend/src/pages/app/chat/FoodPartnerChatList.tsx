import Loader from "@/components/general/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFoodPartnerChats } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

const FoodPartnerChatList = () => {
  const { data: chats, isPending } = useFoodPartnerChats();

  if (isPending)
    return (
      <div className="w-[20vw] hidden md:block h-screen border-r">
        <Loader />;
      </div>
    );

  if (!isPending && (chats?.length ?? 0) === 0) {
    <div className="w-[20vw] hidde h-screen border-r md:flex items-center justify-center">
      <span className="text-muted-foreground">No Chats found.</span>
    </div>;
  }

  return (
    <div>
      <div className="p-4 md:border-b">
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      <div className="flex flex-col items-center gap-4 p-4">
        {chats?.map((chat) => (
          <Link
            to={`/app/chat/${chat._id}`}
            key={chat._id}
            className="w-full cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full bg-secondary">
                <AvatarFallback className="rounded-full">
                  {chat.userId.fullName.trimStart().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <h2>{chat.userId.fullName}</h2>
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

export default FoodPartnerChatList;
