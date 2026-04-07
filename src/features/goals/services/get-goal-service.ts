import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { GoalDetailsResponse } from "@/features/goals/types/response/goal-details"
import type { GetGoalRequest } from "@/features/goals/types/request/get-goal"
import { parseObjectParamsToUrlQueryString } from "@/helpers/urls/url-parsing"

export const getGoalService = async (id: number, req?: GetGoalRequest): Promise<ApiResponse<GoalDetailsResponse>> => {
    const queryParamsString = parseObjectParamsToUrlQueryString(req)
    return await apiClient.get<GoalDetailsResponse>(`${ENDPOINTS_MAP.GOALS.GET_GOAL}/${id}${queryParamsString}`)
}
