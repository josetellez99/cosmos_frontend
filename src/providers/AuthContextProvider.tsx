import { useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { RegisterResponse } from "@/features/auth/types/response/register";

interface AuthContextProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const [user, setUser] = useState<RegisterResponse | undefined>(undefined);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
