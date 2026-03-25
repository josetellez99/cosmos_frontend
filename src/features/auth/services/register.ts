import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpointsMap"
import type { RegisterRequest } from "@/features/auth/types/request/register"
import type { RegisterResponse } from "@/features/auth/types/response/register"
import type { ApiResponse } from "@/types/apiResponses"

export const registerUserService = async (req: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    return await apiClient.post<RegisterResponse>(ENDPOINTS_MAP.AUTH.REGISTER, req)
}