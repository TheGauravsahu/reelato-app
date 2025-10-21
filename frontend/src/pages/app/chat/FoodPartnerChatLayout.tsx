import { Outlet } from "react-router-dom";
import FoodPartnerChatList from "./FoodPartnerChatList";

const FoodPartnerChatLayout = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ChatSidebar />
      <div
   
        className="md:w-[60vw] w-full  relative flex flex-col justify-between h-screen"
      >
        <Outlet />
      </div>
    </div>
  );
};

export const ChatSidebar = () => {
  return (
    <div className="w-full md:w-[20vw] hidden md:block h-screen border-r">
      <FoodPartnerChatList />
    </div>
  );
};

export default FoodPartnerChatLayout;
