import ReelatoLoader from "@/components/general/ReelatoLoader";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const { user, loading } = useUserAuthStore();

  if (loading) return <ReelatoLoader />;

  if (!user) return <Navigate to="/user/login" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;
