import { useQuery } from '@tanstack/react-query'
import type { GetUserSystemsRequest } from '@/features/systems/types/request/get-user-systems'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import { getSystemsService } from '@/features/systems/services/get-systems-service'
import { systemQueryKeys } from '@/features/systems/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

export const useSystems = (filters?: GetUserSystemsRequest) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: systemQueryKeys.list(filters),
		queryFn: () => getSystemsService(filters),
		staleTime: DEFAULT_STALE_TIME,
	})

	let systems: SystemSummaryResponse[];

	if (data && data.ok) {
		systems = data.data
	} else {
		systems = []
	}

	return { systems, isLoading, error, refetch }
}
