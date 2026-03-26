import { useQuery } from '@tanstack/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { getUserGoalsService } from '@/features/goals/services/get-goals-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

export const useGoals = (useSuspense: boolean, filters?: GetUserGoalsRequest) => {

  const callback = useSuspense ? useSuspenseQuery : useQuery;

  const { data, isLoading, error, refetch } = callback({
    queryKey: goalQueryKeys.list(filters),
    queryFn: () => getUserGoalsService(filters),
    staleTime: 10 * 60 * 1000,
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