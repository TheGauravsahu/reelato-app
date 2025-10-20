import { useSidebar } from "@/components/ui/sidebar";
import FoodPartnerChatList from "./FoodPartnerChatList";

const FoodPartnerNoChatPage = () => {
  const { isMobile } = useSidebar();

  return (
    <div>
      {isMobile ? (
        <FoodPartnerChatList />
      ) : (
        <div className="hidden md:block">
          <div>
            <h1 className="text-muted-foreground  flex items-center justify-center h-screen w-full">
              No Chat Selected.
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPartnerNoChatPage;
