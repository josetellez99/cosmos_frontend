import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateHabitRequest } from "@/features/habits/types/request/create-habit"
import type { CreateHabitResponse } from "@/features/habits/types/response/create-habit"
import { CreateHabitService } from "@/features/habits/services/create-habit-service"
import { habitQueryKeys } from "@/features/habits/helpers/queryKeys"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"
import type { ApiResponse, ErrorApiResponse } from "@/types/api_responses"

type CreateHabitContext = {
    snapshots: Array<[readonly unknown[], ApiResponse<HabitSummaryResponse[]> | undefined]>
}

export const useCreateHabit = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error, data } = useMutation<
        CreateHabitResponse,
        ErrorApiResponse,
        CreateHabitRequest,
        CreateHabitContext
    >({
        mutationFn: async (habit) => {
            const response = await CreateHabitService(habit)
            if (!response.ok) {
                throw response
            }
            return response.data
        },

        onMutate: async (newHabit) => {
            await queryClient.cancelQueries({ queryKey: habitQueryKeys.lists() })

            const snapshots = queryClient.getQueriesData<ApiResponse<HabitSummaryResponse[]>>({
                queryKey: habitQueryKeys.lists(),
            })

            const optimisticHabit: HabitSummaryResponse = {
                id: -Date.now(),
                name: newHabit.name,
                description: newHabit.description ?? "",
                emoji: newHabit.emoji,
                schedule_type: newHabit.scheduleType as HabitSummaryResponse["schedule_type"],
                schedule_config: newHabit.scheduleConfig,
                starting_date: newHabit.startingDate,
                progress: 0,
            }

            queryClient.setQueriesData<ApiResponse<HabitSummaryResponse[]>>(
                { queryKey: habitQueryKeys.lists() },
                (old) => {
                    if (!old || !old.ok) return old
                    return { ...old, data: [...old.data, optimisticHabit] }
                }
            )

            return { snapshots }
        },

        onError: (_err, _newHabit, context) => {
            context?.snapshots.forEach(([queryKey, snapshot]) => {
                queryClient.setQueryData(queryKey, snapshot)
            })
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() })
        },
    })

    return { mutate, isPending, error, data }
}
