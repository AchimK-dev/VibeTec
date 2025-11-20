import { AuthContext } from "@/context";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

function AdminLayout() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ next: location.pathname }} />;
  }

  if (user.role !== "ADMIN" && user.role !== "DEMO") {
    return <Navigate to="/artists" />;
  }

  return <Outlet />;
}

export default AdminLayout;
