import { Outlet } from "react-router-dom";
import ChatList from "./ChatList";

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
  return (
    <div className="w-[20vw] hidden md:block h-screen border-r">
      <ChatList />
    </div>
  );
};

export default ChatLayout;
