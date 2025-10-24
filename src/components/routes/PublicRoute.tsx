import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const PublicRoute = () => {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center ">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  } 

  return <Outlet />;
};

export default PublicRoute;
