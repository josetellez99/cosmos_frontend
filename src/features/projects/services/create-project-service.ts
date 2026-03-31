import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import type { CreateProjectResponse } from "@/features/projects/types/response/create-project"
import { apiClient } from "@/lib/apiClient"
import type { ApiResponse } from "@/types/api_responses"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"

export const CreateProjectService = (req: CreateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> => {
    return apiClient.post<CreateProjectResponse>(ENDPOINTS_MAP.PROJECTS.POST_PROJECT, req)
}