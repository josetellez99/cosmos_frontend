import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"
import type { ApiResponse } from "@/types/api_responses"

export const deleteHabitRecordService = (
    habitId: number,
): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(
        `${ENDPOINTS_MAP.HABIT_RECORDS.DELETE_HABIT_RECORD}/${habitId}/records`,
        { headers: { [CSRF_HEADER_NAME]: getCookie(CSRF_COOKIE_NAME) } },
    )
}
