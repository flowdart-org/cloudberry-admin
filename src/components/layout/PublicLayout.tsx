import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
