import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, ErrorApiResponse } from '@/types/api_responses'
import type { HabitForDateResponse } from '@/features/habits/types/response/habit-for-date'
import { deleteHabitRecordService } from '@/features/habit-records/services/delete-habit-record-service'
import { habitQueryKeys } from '@/features/habits/helpers/queryKeys'
import type { DateTypeHabit } from '@/features/habits/types/date-type-habits'

interface Variables {
  habitId: number
  date: string
}

type Context = {
  snapshot: ApiResponse<HabitForDateResponse[]> | undefined
}

export const useDeleteHabitRecord = (dateType: DateTypeHabit) => {

  const queryClient = useQueryClient()

  const { mutate, isPending, error, data } = useMutation<
    null,
    ErrorApiResponse,
    Variables,
    Context
  >({

    mutationFn: async ({ habitId, date }) => {
      const response = await deleteHabitRecordService(habitId, date)
      if (!response.ok) {
        throw response
      }
      return response.data
    },

    onMutate: async ({ habitId, date }) => {
      const queryKey = habitQueryKeys.byDate(date, dateType)
      await queryClient.cancelQueries({ queryKey })

      const snapshot = queryClient.getQueryData<ApiResponse<HabitForDateResponse[]>>(queryKey)

      queryClient.setQueryData<ApiResponse<HabitForDateResponse[]>>(queryKey, (old) => {
        if (!old || !old.ok) return old
        return {
          ...old,
          data: old.data.map((h) => (h.id === habitId ? { ...h, isChecked: false } : h)),
        }
      })

      return { snapshot }
    },

    onError: (_err, { date }, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(habitQueryKeys.byDate(date, dateType), context.snapshot)
      }
    },

    onSuccess: (_data, { date }) => {
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.byDate(date, dateType) })
    },
  })

  return { mutate, isPending, error, data }
}
