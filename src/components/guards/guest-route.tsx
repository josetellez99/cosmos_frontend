import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";

export function GuestRoute() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("GuestRoute must be used within an AuthProvider");

    if (context.user) return <Navigate to="/" replace />;

    return <Outlet />;
}
