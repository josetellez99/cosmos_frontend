import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, ErrorApiResponse } from '@/types/api_responses'
import { updateHabitSystemService } from '@/features/habitSystem/services/update-habit-system-service'
import { systemQueryKeys } from '@/features/systems/helpers/queryKeys'
import type { SystemDetailResponse } from '@/features/systems/types/response/system-detail'

interface UpdateHabitSystemVariables {
    // Identifies which habit_system row to update.
    habitSystemId: number
    // The system that owns the link — needed because habit_system rows have no
    // independent cache. The detail cache for this system is the only place
    // the new weight needs to land.
    systemId: number
    habitWeight: number
}

type SystemDetailCache = ApiResponse<SystemDetailResponse>

interface UpdateHabitSystemContext {
    snapshot: SystemDetailCache | undefined
}

export const useUpdateHabitSystem = () => {

    const queryClient = useQueryClient()

    const { mutate, isPending, error, data } = useMutation<
        void,
        ErrorApiResponse,
        UpdateHabitSystemVariables,
        UpdateHabitSystemContext
    >({

        mutationFn: async ({ habitSystemId, habitWeight }) => {
            const response = await updateHabitSystemService(habitSystemId, { habitWeight })
            if (!response.ok) {
                throw response
            }
        },

        onMutate: async ({ habitSystemId, systemId, habitWeight }) => {
            await queryClient.cancelQueries({ queryKey: systemQueryKeys.detail(systemId) })

            const snapshot = queryClient.getQueryData<SystemDetailCache>(
                systemQueryKeys.detail(systemId),
            )

            queryClient.setQueryData<SystemDetailCache>(
                systemQueryKeys.detail(systemId),
                (old) => {
                    if (!old || !old.ok) return old
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            habits: old.data.habits.map(habit =>
                                habit.habitSystemId === habitSystemId
                                    ? { ...habit, habitWeight }
                                    : habit,
                            ),
                        },
                    }
                },
            )

            return { snapshot }
        },

        onError: (_err, { systemId }, context) => {
            if (context?.snapshot !== undefined) {
                queryClient.setQueryData(systemQueryKeys.detail(systemId), context.snapshot)
            }
        },

        onSuccess: (_data, { systemId }) => {
            queryClient.invalidateQueries({ queryKey: systemQueryKeys.detail(systemId) })
        },
    })

    return { mutate, isPending, error, data }
}
