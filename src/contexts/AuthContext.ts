import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserSession } from "@/features/auth/types/UserSession";

export interface AuthContextType {
    user: UserSession | null;
    setUser: Dispatch<SetStateAction<UserSession | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);