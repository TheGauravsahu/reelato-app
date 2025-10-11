import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  User2,
  Settings,
  History,
  Bookmark,
  Heart,
  ListMusic,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { NavUser } from "./NavUser";

const items = [
  {
    name: "Chats",
    href: "/chat",
    icon: MessageCircle,
  },

  {
    name: "Liked",
    href: "/feed/liked",
    icon: Heart,
  },
  {
    name: "Saved",
    href: "/feed/saved",
    icon: Bookmark,
  },
  {
    name: "History",
    href: "/feed/history",
    icon: History,
  },

  {
    name: "Playlists",
    href: "/feed/playlists",
    icon: ListMusic,
  },

  {
    name: "Account",
    href: "/settings/account",
    icon: User2,
  },
  {
    name: "Preferences",
    href: "/settings/preferences",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { theme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-1 items-center border-b p-4">
          <img
            key={theme}
            src={theme === "light" ? "/reelato-dark.svg" : "/reelato-light.svg"}
            className="h-4 w-4 md:h-6 md:w-6"
            alt="Reelato Logo"
          />
          <h1 className="text-center font-semibold text-lg  md:text-xl text-foreground">
            Reelato
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
