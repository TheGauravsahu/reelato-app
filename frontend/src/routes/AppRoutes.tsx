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
