import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

export const getHabitsService = async (): Promise<ApiResponse<HabitSummaryResponse[]>> => {
    return await apiClient.get<HabitSummaryResponse[]>(ENDPOINTS_MAP.HABITS.GET_HABITS)
}
