import { useSuspenseQuery } from '@tanstack/react-query'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { getUserGoalsService } from '@/features/goals/services/get-goals-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

export const useGoalsSuspense = (filters?: GetUserGoalsRequest) => {
  const { data, refetch } = useSuspenseQuery({
    queryKey: goalQueryKeys.list(filters),
    queryFn: () => getUserGoalsService(filters),
    staleTime: 10 * 60 * 1000,
  })

  const goals: GoalSummaryResponse[] = data?.ok ? data.data : []

  return { goals, refetch }
}
