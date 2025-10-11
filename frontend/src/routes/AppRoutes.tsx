import LoginFoodPartner from "@/pages/foodPartner/LoginFoodPartner";
import RegisterFoodPartner from "@/pages/foodPartner/RegisterFoodPartner";
import HomePage from "@/pages/home";
import LoginUser from "@/pages/user/LoginUser";
import RegisterUser from "@/pages/user/RegisterUser";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import AccountPage from "@/pages/settings/Account";
import PrefrencesPage from "@/pages/settings/Prefrences";
import NotFoundPage from "@/pages/notFound";
import FoodPartnerStorePage from "@/pages/foodPartner/store";
import SettingsLayout from "@/pages/settings/SettingsLayout";
import { Layout } from "@/components/general/Layout";
import HistoryPage from "@/pages/feed/history";
import SavedPage from "@/pages/feed/saved";
import LikedPage from "@/pages/feed/liked";
import PlaylistsPage from "@/pages/feed/playlists";
import PlaylistDetailsPage from "@/pages/feed/playlists/PlaylistDetails";
import ChatPage from "@/pages/chat";
import ChatLayout from "@/pages/chat/ChatLayout";
import NoChatPage from "@/pages/chat/NoChat";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        //protected routes
        <Route element={<UserProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/food-partner/:id"
              element={<FoodPartnerStorePage />}
            />
          </Route>

          <Route element={<SettingsLayout />}>
            <Route path="/settings/account" element={<AccountPage />} />
            <Route path="/settings/preferences" element={<PrefrencesPage />} />
            <Route path="/feed/history" element={<HistoryPage />} />
            <Route path="/feed/saved" element={<SavedPage />} />
            <Route path="/feed/liked" element={<LikedPage />} />
            <Route path="/feed/playlists" element={<PlaylistsPage />} />
            <Route
              path="/feed/playlists/:id"
              element={<PlaylistDetailsPage />}
            />
          </Route>

          <Route element={<SettingsLayout />}>
            <Route element={<ChatLayout />}>
              <Route path="/chat" element={<NoChatPage />} />
              <Route path="/chat/:chatId" element={<ChatPage />} />
            </Route>
          </Route>
        </Route>
        //user routes
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
        //food partner routes
        <Route
          path="/food-partner/register"
          element={<RegisterFoodPartner />}
        />
        <Route path="/food-partner/login" element={<LoginFoodPartner />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
