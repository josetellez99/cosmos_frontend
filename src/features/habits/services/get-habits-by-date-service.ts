import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { HabitForDateResponse } from "@/features/habits/types/response/habit-for-date"

export const getHabitsByDateService = async (date: string): Promise<ApiResponse<HabitForDateResponse[]>> => {
    return await apiClient.get<HabitForDateResponse[]>(`${ENDPOINTS_MAP.HABITS.GET_HABITS_BY_DATE}/${date}`)
}
