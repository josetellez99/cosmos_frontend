import type { CreateHabitRequest } from "@/features/habits/types/request/create-habit"
import type { CreateHabitResponse } from "@/features/habits/types/response/create-habit"
import { apiClient } from "@/lib/apiClient"
import type { ApiResponse } from "@/types/api_responses"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"

export const CreateHabitService = (
    req: CreateHabitRequest
): Promise<ApiResponse<CreateHabitResponse>> => {
    return apiClient.post<CreateHabitResponse>(
        ENDPOINTS_MAP.HABITS.POST_HABIT,
        req,
        { headers: { [CSRF_HEADER_NAME]: (getCookie(CSRF_COOKIE_NAME) ?? "") } }
    )
}
