import { useQuery } from '@tanstack/react-query'
import type { GoalDetailsResponse } from '@/features/goals/types/response/goal-details'
import { getGoalService } from '@/features/goals/services/get-goal-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'
import type { GetGoalRequest } from '@/features/goals/types/request/get-goal'

export const useGoal = (id: number, req?: GetGoalRequest) => {

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: goalQueryKeys.detail(id),
    queryFn: () => getGoalService(id, req),
    staleTime: DEFAULT_STALE_TIME,
    enabled: !!id,
  })

  let goal: GoalDetailsResponse | null

  if (data && data.ok) {
    goal = data.data
  } else {
    goal = null
  }

  return {
    goal,
    isLoading,
    error,
    refetch,
  }
}
