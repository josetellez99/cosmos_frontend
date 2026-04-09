import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import type { CreateProjectResponse } from "@/features/projects/types/response/create-project"
import { apiClient } from "@/lib/apiClient"
import type { ApiResponse } from "@/types/api_responses"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import { getCookie } from "@/helpers/cookies";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants/global_constants";
import { formatProjectRequest } from "@/features/projects/helpers/format-project-request"

export const CreateProjectService = (req: CreateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> => {
    const formattedRequest = formatProjectRequest(req)
    console.log(formattedRequest)
    return apiClient.post<CreateProjectResponse>(ENDPOINTS_MAP.PROJECTS.POST_PROJECT, formattedRequest, { headers: { [CSRF_HEADER_NAME]: getCookie(CSRF_COOKIE_NAME) } })
}