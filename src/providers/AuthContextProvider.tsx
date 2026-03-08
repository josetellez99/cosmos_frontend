import { useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { UserSession } from "@/features/auth/types/UserSession";
import { getUserSession } from "@/features/auth/helpers/getUserSession";
import { useMemo } from "react";

interface AuthContextProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const sessionFromCookie = getUserSession();
    const [user, setUser] = useState<UserSession | null>(sessionFromCookie);

    const value = useMemo(() => ({ user, setUser}), [user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
