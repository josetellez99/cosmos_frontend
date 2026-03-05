import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/endpointsMap"
import type { RegisterRequest } from "@/features/auth/types/request/register"
import type { RegisterResponse } from "@/features/auth/types/response/register"
import type { ApiResponse } from "@/lib/apiResponses"

export const registerUserService = async (req: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    return await apiClient.post<ApiResponse<RegisterResponse>>(ENDPOINTS_MAP.AUTH.REGISTER, req)
}