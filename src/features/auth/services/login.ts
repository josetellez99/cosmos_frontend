import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { LoginRequest } from "@/features/auth/types/request/login"
import type { ApiResponse } from "@/types/api_responses"
import type { UserSession } from "@/features/auth/types/UserSession"

export const loginService = async (req: LoginRequest): Promise<ApiResponse<UserSession>> => {
    return await apiClient.post<UserSession>(ENDPOINTS_MAP.AUTH.LOGIN, req)
}
