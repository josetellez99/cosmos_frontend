import { useSuspenseQuery } from '@tanstack/react-query'
import type { HabitForDateResponse } from '@/features/habits/types/response/habit-for-date'
import { getHabitsByDateService } from '@/features/habits/services/get-habits-by-date-service'
import { habitQueryKeys } from '@/features/habits/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'
import type { DateTypeHabit } from '@/features/habits/types/date-type-habits'

export const useHabitsByDateSuspense = (date: string, dateType: DateTypeHabit) => {

  const { data, isLoading, error, refetch } = useSuspenseQuery({
    queryKey: habitQueryKeys.byDate(date, dateType),
    queryFn: () => getHabitsByDateService(date, dateType),
    staleTime: DEFAULT_STALE_TIME,
  })

  let habits: HabitForDateResponse[];

  if(data && data.ok) {
    habits = data.data
  } else {
    habits = []
  }

  return {
    habits,
    isLoading,
    error,
    refetch
  }
}
