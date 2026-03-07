import type { RegisterRequest } from "@/features/auth/types/request/register";
import type { LoginRequest } from "@/features/auth/types/request/login";
import type { ApiResponse } from "@/lib/apiResponses";
import type { RegisterResponse } from "@/features/auth/types/response/register";
import type { UserSession } from "@/features/auth/types/UserSession";
import type { VerifyEmailRequest } from "@/features/auth/types/request/verify-email";

import { registerUserService } from "@/features/auth/services/register";
import { verifyEmailService } from "@/features/auth/services/verify-email-service";
import { loginService } from "@/features/auth/services/login";

import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    const { setUser } = context;

    const registerUser = async (req: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
        return await registerUserService(req)
    }

    const verifyEmail = async (req: VerifyEmailRequest): Promise<ApiResponse<unknown>> => {
        return await verifyEmailService(req)
    }

    const loginUser = async (req: LoginRequest): Promise<ApiResponse<UserSession>> => {
        const response = await loginService(req);
        if (response.ok) {
            setUser(response.data);
        }
        return response;
    }

    return {
        registerUser,
        verifyEmail,
        loginUser
    }
}