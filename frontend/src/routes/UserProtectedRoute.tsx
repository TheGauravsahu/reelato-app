import ReelatoLoader from "@/components/general/ReelatoLoader";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const { user, loading, checkAuth } = useUserAuthStore();

  useEffect(() => {
    if (!user) checkAuth();
  }, [user, checkAuth]);

  if (loading) return <ReelatoLoader />;

  if (!user) return <Navigate to="/user/login" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;
