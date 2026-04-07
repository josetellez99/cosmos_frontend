import { apiClient } from "@/lib/apiClient"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies"
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants"
import type { ApiResponse } from "@/types/api_responses"
import type { UpdateGoalLinkRequest } from "@/features/goalLink/types/request/update-goal-link"

export const updateGoalLinkService = (
    id: number,
    body: UpdateGoalLinkRequest,
): Promise<ApiResponse<void>> => {
    console.log("body", body)
    console.log("id", id)
    return apiClient.put<void, UpdateGoalLinkRequest>(
        `${ENDPOINTS_MAP.GOAL_LINK.PUT_GOAL_LINK}/${id}`,
        body,
        { headers: { [CSRF_HEADER_NAME]: getCookie(CSRF_COOKIE_NAME) } },
    )
}
