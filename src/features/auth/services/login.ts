import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/endpointsMap"
import type { LoginRequest } from "@/features/auth/types/request/login"
import type { ApiResponse } from "@/lib/apiResponses"
import type { UserSession } from "@/features/auth/types/UserSession"

export const loginService = async (req: LoginRequest): Promise<ApiResponse<UserSession>> => {
    return await apiClient.post<ApiResponse<UserSession>>(ENDPOINTS_MAP.AUTH.LOGIN, req)
}
