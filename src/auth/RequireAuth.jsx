import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RequireAuth({ role }) {
    const location = useLocation();

    const token = useAuthStore((s) => s.token);
    const userRole = useAuthStore((s) => s.user?.role);

    const normalizedRole = role?.toUpperCase();
    const normalizedUserRole = userRole?.toUpperCase();

    const isAuth = !!token;

    const hasAccess =
        isAuth && (!normalizedRole || normalizedUserRole === normalizedRole);

    if (!hasAccess) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}