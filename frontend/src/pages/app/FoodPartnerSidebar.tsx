import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User2, Settings, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/general/theme-provider";
import { NavUser } from "@/components/general/NavUser";
import { Link } from "react-router-dom";
import { useFoodPartnerAuthStore } from "@/hooks/useFoodPartnerAuthStore";

const items = [
  {
    name: "Chats",
    href: "/app/chat",
    icon: MessageCircle,
  },
  {
    name: "Account",
    href: "/app/account",
    icon: User2,
  },
  {
    name: "Preferences",
    href: "/app/preferences",
    icon: Settings,
  },
];

const FoodPartnerSidebar = () => {
  const { theme } = useTheme();
  const { foodPartner, logout } = useFoodPartnerAuthStore();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center border-b p-4">
          <img
            key={theme}
            src={theme === "light" ? "/reelato-dark.svg" : "/reelato-light.svg"}
            className="h-4 w-4 md:h-7 md:w-7"
            alt="Reelato Logo"
          />
          <h1 className="text-center font-bold text-xl w-full text-foreground">
            Reelato - Partner
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4">
            {items.map((item) => (
              <Link
                to={item.href}
                key={item.name}
                className="flex flex-row items-center justify-start gap-2 my-4 hover:text-primary"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-md ">{item.name}</span>
              </Link>
            ))}
          </div>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            fullName: foodPartner?.fullName as string,
            email: foodPartner?.email as string,
          }}
          logout={logout}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default FoodPartnerSidebar;
