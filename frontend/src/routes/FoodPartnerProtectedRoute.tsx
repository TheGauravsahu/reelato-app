import { useFoodParnterAuthStore } from "@/hooks/useFoodPartnerAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const FoodPartnerProtectedRoute = () => {
  const { foodPartner, loading, checkAuth } = useFoodParnterAuthStore();

  useEffect(() => {
    if (!foodPartner) checkAuth();
  }, [foodPartner, checkAuth]);

  if (loading)
    return (
      <div className="bg-secondary h-screen flex items-center justify-center">
        <h1 className="text-center font-bold text-3xl animate-caret-blink text-secondary">
          Reelato - Food Partners
        </h1>
      </div>
    );
  if (!foodPartner) return <Navigate to="/food-partner/login" replace />;

  return <Outlet />;
};

export default FoodPartnerProtectedRoute;
