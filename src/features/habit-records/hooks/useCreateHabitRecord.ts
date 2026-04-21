import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, ErrorApiResponse } from '@/types/api_responses'
import type { HabitForDateResponse } from '@/features/habits/types/response/habit-for-date'
import type { HabitRecordResponse } from '@/features/habit-records/types/response/habit-record'
import { createHabitRecordService } from '@/features/habit-records/services/create-habit-record-service'
import { habitQueryKeys } from '@/features/habits/helpers/queryKeys'
import type { DateTypesForAmountRangeHabit } from '@/features/habits/types/date-type-amount-range-habits'

interface Variables {
  habitId: number
}

interface Args {
  date: string
  dateType: DateTypesForAmountRangeHabit
}

type Context = {
  snapshot: ApiResponse<HabitForDateResponse[]> | undefined
}

export const useCreateHabitRecord = ({ date, dateType }: Args) => {

  const queryClient = useQueryClient()
  const queryKey = habitQueryKeys.byDate(date, dateType)

  const { mutate, isPending, error, data } = useMutation<
    HabitRecordResponse,
    ErrorApiResponse,
    Variables,
    Context
  >({

    mutationFn: async ({ habitId }) => {
      const response = await createHabitRecordService(habitId, { isCompleted: true })
      if (!response.ok) {
        throw response
      }
      return response.data
    },

    onMutate: async ({ habitId }) => {
      await queryClient.cancelQueries({ queryKey })

      const snapshot = queryClient.getQueryData<ApiResponse<HabitForDateResponse[]>>(queryKey)

      queryClient.setQueryData<ApiResponse<HabitForDateResponse[]>>(queryKey, (old) => {
        if (!old || !old.ok) return old
        return {
          ...old,
          data: old.data.map((h) => (h.id === habitId ? { ...h, isChecked: true } : h)),
        }
      })

      return { snapshot }
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return { mutate, isPending, error, data }
}
