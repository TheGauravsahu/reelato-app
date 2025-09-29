import LoginFoodPartner from "@/pages/foodPartner/LoginFoodPartner";
import RegisterFoodPartner from "@/pages/foodPartner/RegisterFoodPartner";
import HomePage from "@/pages/home";
import LoginUser from "@/pages/user/LoginUser";
import RegisterUser from "@/pages/user/RegisterUser";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProtectedRoute from "./UserProtectedRoute";
import Layout from "@/pages/settings/Layout";
import AccountPage from "@/pages/settings/Account";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        //protected routes
        <Route element={<UserProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<Layout />}>
            <Route path="/settings/account" element={<AccountPage />} />
          </Route>
        </Route>
        //user partner routes
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
        //food partner routes
        <Route
          path="/food-partner/register"
          element={<RegisterFoodPartner />}
        />
        <Route path="/food-partner/login" element={<LoginFoodPartner />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
