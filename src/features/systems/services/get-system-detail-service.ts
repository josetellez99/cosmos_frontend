import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { SystemDetailResponse } from "@/features/systems/types/response/system-detail"

export const getSystemDetailService = async (id: number): Promise<ApiResponse<SystemDetailResponse>> => {
    return await apiClient.get<SystemDetailResponse>(`${ENDPOINTS_MAP.SYSTEMS.GET_SYSTEM}/${id}`)
}
