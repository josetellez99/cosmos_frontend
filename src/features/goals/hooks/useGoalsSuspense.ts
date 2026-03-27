import { useSuspenseQuery } from '@tanstack/react-query'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { getUserGoalsService } from '@/features/goals/services/get-goals-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

export const useGoalsSuspense = (filters?: GetUserGoalsRequest) => {

  const { data, isLoading, error, refetch } = useSuspenseQuery({
    queryKey: goalQueryKeys.list(filters),
    queryFn: () => getUserGoalsService(filters),
    staleTime: DEFAULT_STALE_TIME,
  })

  let goals: GoalSummaryResponse[];

  if(data && data.ok) {
    goals = data.data
  } else {
    goals = []
  }

  return {
    goals,
    isLoading,
    error,
    refetch
  }
}