import { createContext, type Dispatch, type SetStateAction } from "react";
import type { RegisterResponse } from "@/features/auth/types/response/register";

export interface AuthContextType {
    user: RegisterResponse | undefined;
    setUser: Dispatch<SetStateAction<RegisterResponse | undefined>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);