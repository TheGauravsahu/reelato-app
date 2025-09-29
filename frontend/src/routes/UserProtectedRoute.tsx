import { useUserAuthStore } from "@/hooks/useUserAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const { user, loading } = useUserAuthStore();

  if (loading)
    return (
      <div className="bg-primary h-screen flex items-center justify-center gap-2">
        <span className="animate-spin">
          <img
            src="/reelato-light.svg"
            className="h-8 w-8"
            alt="Reelato Logo"
          />
        </span>
        <h1 className="text-center font-bold text-4xl text-white">Reelato</h1>
      </div>
    );

  if (!user) return <Navigate to="/user/login" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;
