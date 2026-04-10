import { useSuspenseQuery } from "@tanstack/react-query"
import type { SystemDetailResponse } from "@/features/systems/types/response/system-detail"
import { getSystemDetailService } from "@/features/systems/services/get-system-detail-service"
import { systemQueryKeys } from "@/features/systems/helpers/queryKeys"
import { DEFAULT_STALE_TIME } from "@/lib/constants/global_constants"

export const useSystemDetailSuspense = (id: number) => {
    const { data, error, refetch } = useSuspenseQuery({
        queryKey: systemQueryKeys.detail(id),
        queryFn: () => getSystemDetailService(id),
        staleTime: DEFAULT_STALE_TIME,
    })

    if (!data.ok) {
        throw new Error("No se pudo cargar el sistema")
    }

    const system: SystemDetailResponse = data.data

    return { system, error, refetch }
}
