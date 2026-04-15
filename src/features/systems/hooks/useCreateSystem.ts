import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateSystemRequest } from "@/features/systems/types/request/create-system"
import type { CreateSystemResponse } from "@/features/systems/types/response/create-system"
import { CreateSystemService } from "@/features/systems/services/create-system-service"
import { systemQueryKeys } from "@/features/systems/helpers/queryKeys"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import type { ApiResponse, ErrorApiResponse } from "@/types/api_responses"

type CreateSystemContext = {
    snapshots: Array<[readonly unknown[], ApiResponse<SystemSummaryResponse[]> | undefined]>
}

export const useCreateSystem = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error, data } = useMutation<
        CreateSystemResponse,
        ErrorApiResponse,
        CreateSystemRequest,
        CreateSystemContext
    >({
        mutationFn: async (system) => {
            const response = await CreateSystemService(system)
            if (!response.ok) {
                throw response
            }
            return response.data
        },

        onMutate: async (newSystem) => {
            await queryClient.cancelQueries({ queryKey: systemQueryKeys.lists() })

            const snapshots = queryClient.getQueriesData<ApiResponse<SystemSummaryResponse[]>>({
                queryKey: systemQueryKeys.lists(),
            })

            const optimisticSystem: SystemSummaryResponse = {
                id: -Date.now(),
                name: newSystem.name,
                description: newSystem.description ?? null,
                symbol: newSystem.symbol,
                startingDate: newSystem.startingDate,
                createdAt: null,
                modifiedAt: null,
                progress: 0,
            }

            queryClient.setQueriesData<ApiResponse<SystemSummaryResponse[]>>(
                { queryKey: systemQueryKeys.lists() },
                (old) => {
                    if (!old || !old.ok) return old
                    return { ...old, data: [...old.data, optimisticSystem] }
                }
            )

            return { snapshots }
        },

        onError: (_err, _newSystem, context) => {
            context?.snapshots.forEach(([queryKey, snapshot]) => {
                queryClient.setQueryData(queryKey, snapshot)
            })
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemQueryKeys.lists() })
        },
    })

    return { mutate, isPending, error, data }
}
