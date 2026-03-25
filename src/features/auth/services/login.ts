import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpointsMap"
import type { LoginRequest } from "@/features/auth/types/request/login"
import type { ApiResponse } from "@/types/apiResponses"
import type { UserSession } from "@/features/auth/types/UserSession"

export const loginService = async (req: LoginRequest): Promise<ApiResponse<UserSession>> => {
    return await apiClient.post<UserSession>(ENDPOINTS_MAP.AUTH.LOGIN, req)
}
