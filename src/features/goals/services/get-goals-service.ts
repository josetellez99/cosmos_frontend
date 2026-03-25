import { apiClient } from "@/lib/apiClient"
import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import { parseObjectParamsToUrlQueryString } from "@/helpers/urls/url-parsing"

export const getUserGoalsService = async (req?: GetUserGoalsRequest): Promise<ApiResponse<GoalSummaryResponse[]>> => {
    const queryParamsString = parseObjectParamsToUrlQueryString(req)
    return await apiClient.get<GoalSummaryResponse[]>(`${ENDPOINTS_MAP.GOALS.GET_USER_GOALS}${queryParamsString}`)
}