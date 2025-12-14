import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCategoryStore } from "@/store/useCategoryStore";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const { fetchAll } = useCategoryStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  
  
  useEffect(() => {
    if(isLoading) fetchUser();
  }, [fetchAll]);
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
