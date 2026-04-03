import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface GetGoalOptions {
    includeProgress?: boolean
}

export const getGoalService = async (id: number, options?: GetGoalOptions): Promise<ApiResponse<GoalSummaryResponse>> => {
    const params = new URLSearchParams()

    if (options?.includeProgress !== undefined) {
        params.set("includeProgress", String(options.includeProgress))
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""
    return await apiClient.get<GoalSummaryResponse>(`${ENDPOINTS_MAP.GOALS.GET_GOAL}/${id}${queryString}`)
}
