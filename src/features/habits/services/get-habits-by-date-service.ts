import { apiClient } from "@/lib/apiClient"
import type { ApiResponse } from "@/types/api_responses"
import type { HabitForDateResponse } from "@/features/habits/types/response/habit-for-date"
import type { DateTypesForAmountRangeHabit } from '@/features/habits/types/date-type-amount-range-habits'
import { getEndpointForDateTypeHabit } from "@/features/habits/helpers/get-endpoint-for-datetype-habit"

export const getHabitsByDateService = async (date: string, dateType: DateTypesForAmountRangeHabit): Promise<ApiResponse<HabitForDateResponse[]>> => {
    const endpoint = getEndpointForDateTypeHabit(dateType)
    return await apiClient.get<HabitForDateResponse[]>(`${endpoint}/${date}`)
}
