import { registerUserService } from "@/features/auth/services/register";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import type { RegisterRequest } from "@/features/auth/types/request/register";
import type { ApiResponse } from "@/lib/apiResponses";
import type { RegisterResponse } from "@/features/auth/types/response/register";
import type { VerifyEmailRequest } from "@/features/auth/types/request/verify-email";
import { verifyEmailService } from "@/features/auth/services/verify-email-service";

export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    const { user, setUser } = context;

    const registerUser = async (req: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
        return await registerUserService(req)
    }

    const verifyEmail = async (req: VerifyEmailRequest): Promise<ApiResponse<unknown>> => {
        return await verifyEmailService(req)
    }

    const loginUser = () => {

    }

    return {
        registerUser,
        verifyEmail,
        loginUser
    }
}