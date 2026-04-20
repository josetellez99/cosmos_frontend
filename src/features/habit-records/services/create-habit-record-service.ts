import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"
import type { ApiResponse } from "@/types/api_responses"
import type { CreateHabitRecordRequest } from "@/features/habit-records/types/request/create-habit-record"
import type { HabitRecordResponse } from "@/features/habit-records/types/response/habit-record"

export const createHabitRecordService  = async (
    habitId: number,
    body: CreateHabitRecordRequest,
): Promise<ApiResponse<HabitRecordResponse>> => {
    return apiClient.post<HabitRecordResponse, CreateHabitRecordRequest>(
        `${ENDPOINTS_MAP.HABIT_RECORDS.POST_HABIT_RECORD}/${habitId}/records`,
        body,
        { headers: { [CSRF_HEADER_NAME]: (getCookie(CSRF_COOKIE_NAME) ?? "") } },
    )
}
