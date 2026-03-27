import { apiClient } from "@/lib/apiClient";
import type { GetProjectsRequest } from "@/features/projects/types/request/get-projects";
import { parseObjectParamsToUrlQueryString } from "@/helpers/urls/url-parsing";
import type { ApiResponse } from "@/types/api_responses";
import type { ProjectsSummary } from "@/features/projects/types/response/projects";
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map";

export const getprojectsService = (req?: GetProjectsRequest): Promise<ApiResponse<ProjectsSummary[]>> => {
    const queryParamsString = parseObjectParamsToUrlQueryString(req)
    return apiClient.get<ProjectsSummary[]>(`${ENDPOINTS_MAP.PROJECTS.GET_PROJECTS}${queryParamsString}`)
}