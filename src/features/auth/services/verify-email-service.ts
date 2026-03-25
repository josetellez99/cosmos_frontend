import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { VerifyEmailRequest } from "@/features/auth/types/request/verify-email"
import type { ApiResponse } from "@/types/api_responses"

export const verifyEmailService = async (req: VerifyEmailRequest): Promise<ApiResponse<unknown>> => {
    return await apiClient.post<ApiResponse<unknown>>(ENDPOINTS_MAP.AUTH.VERIFY_EMAIL, req)
}