import { apiClient } from "@/lib/apiClient"
import type { GetUserSystemsRequest } from "@/features/systems/types/request/get-user-systems"
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"
import type { ApiResponse } from "@/types/api_responses"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import { parseObjectParamsToUrlQueryString } from "@/helpers/urls/url-parsing"

export const getSystemsService = async (req?: GetUserSystemsRequest): Promise<ApiResponse<SystemSummaryResponse[]>> => {
	const queryParamsString = parseObjectParamsToUrlQueryString(req)
	return await apiClient.get<SystemSummaryResponse[]>(`${ENDPOINTS_MAP.SYSTEMS.GET_SYSTEMS}${queryParamsString}`)
}
