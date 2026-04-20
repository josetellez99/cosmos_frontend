import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"
import type { ApiResponse } from "@/types/api_responses"
import type { UpdateHabitSystemRequest } from "@/features/habitSystem/types/request/update-habit-system"

export const updateHabitSystemService = (
    id: number,
    body: UpdateHabitSystemRequest,
): Promise<ApiResponse<void>> => {
    return apiClient.put<void, UpdateHabitSystemRequest>(
        `${ENDPOINTS_MAP.HABIT_SYSTEM.PUT_HABIT_SYSTEM}/${id}`,
        body,
        { headers: { [CSRF_HEADER_NAME]: (getCookie(CSRF_COOKIE_NAME) ?? "") } },
    )
}
