import { useSuspenseQuery } from '@tanstack/react-query'
import type { HabitSummaryResponse } from '@/features/habits/types/response/habits'
import { getHabitsService } from '@/features/habits/services/get-habits-service'
import { habitQueryKeys } from '@/features/habits/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

export const useHabitsSuspense = () => {

  const { data, isLoading, error, refetch } = useSuspenseQuery({
    queryKey: habitQueryKeys.list(),
    queryFn: () => getHabitsService(),
    staleTime: DEFAULT_STALE_TIME,
  })

  let habits: HabitSummaryResponse[];

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
