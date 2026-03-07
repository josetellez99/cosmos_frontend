import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/endpointsMap"
import type { VerifyEmailRequest } from "@/features/auth/types/request/verify-email"
import type { ApiResponse } from "@/lib/apiResponses"

export const verifyEmailService = async (req: VerifyEmailRequest): Promise<ApiResponse<unknown>> => {
    return await apiClient.post<ApiResponse<unknown>>(ENDPOINTS_MAP.AUTH.VERIFY_EMAIL, req)
}