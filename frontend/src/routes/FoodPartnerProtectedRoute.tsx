import FoodPartnerLoader from "@/components/general/FoodPartnerLoader";
import { useFoodPartnerAuthStore } from "@/hooks/useFoodPartnerAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const FoodPartnerProtectedRoute = () => {
  const { foodPartner, loading, checkAuth } = useFoodPartnerAuthStore();

  useEffect(() => {
    if (!foodPartner) checkAuth();
  }, [foodPartner, checkAuth]);

  if (loading) return <FoodPartnerLoader />;

  if (!foodPartner) return <Navigate to="/food-partner/login" replace />;

  return <Outlet />;
};

export default FoodPartnerProtectedRoute;
