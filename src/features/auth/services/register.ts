import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/endpointsMap"
import type { registerRequest } from "@/features/auth/types/request/register"
import type { registerResponse } from "@/features/auth/types/response/register"
import type { ApiResponse } from "@/lib/apiResponses"

export const register = async (req: registerRequest): Promise<ApiResponse<registerResponse>> => {
    return await apiClient.post<ApiResponse<registerResponse>>(ENDPOINTS_MAP.AUTH.REGISTER, req)
}