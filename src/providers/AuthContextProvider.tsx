import { useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { UserSession } from "@/features/auth/types/UserSession";
import { useUserSession } from "@/features/auth/hooks/useUserSession";

interface AuthContextProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const sessionFromCookie = useUserSession();
    const [user, setUser] = useState<UserSession | null>(sessionFromCookie);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
