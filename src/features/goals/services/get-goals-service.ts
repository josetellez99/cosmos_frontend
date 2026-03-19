import { apiClient } from "@/lib/apiClient"
import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"
import { ENDPOINTS_MAP } from "@/lib/endpointsMap"
import type { ApiResponse } from "@/lib/apiResponses"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import { parseObjectParamsToUrlQueryString } from "@/helpers/urlParsing"

export const getUserGoalsService = async (req?: GetUserGoalsRequest): Promise<ApiResponse<GoalSummaryResponse[]>> => {
    const queryParamsString = parseObjectParamsToUrlQueryString(req)
    return await apiClient.get<GoalSummaryResponse[]>(`${ENDPOINTS_MAP.GOALS.GET_USER_GOALS}${queryParamsString}`)
}