import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";

export function ProtectedRoute() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("ProtectedRoute must be used within an AuthProvider");

    if (!context.user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
