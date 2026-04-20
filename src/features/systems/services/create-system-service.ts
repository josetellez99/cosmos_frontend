import type { CreateSystemRequest } from "@/features/systems/types/request/create-system"
import type { CreateSystemResponse } from "@/features/systems/types/response/create-system"
import { apiClient } from "@/lib/apiClient"
import type { ApiResponse } from "@/types/api_responses"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"

export const CreateSystemService = (
    req: CreateSystemRequest
): Promise<ApiResponse<CreateSystemResponse>> => {
    return apiClient.post<CreateSystemResponse>(
        ENDPOINTS_MAP.SYSTEMS.POST_SYSTEM,
        req,
        { headers: { [CSRF_HEADER_NAME]: (getCookie(CSRF_COOKIE_NAME) ?? "") } }
    )
}
