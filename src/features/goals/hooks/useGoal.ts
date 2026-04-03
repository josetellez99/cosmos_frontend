import { useQuery } from '@tanstack/react-query'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { getGoalService } from '@/features/goals/services/get-goal-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

interface UseGoalOptions {
  includeProgress?: boolean
}

export const useGoal = (id: number, options?: UseGoalOptions) => {

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: goalQueryKeys.detail(id),
    queryFn: () => getGoalService(id, options),
    staleTime: DEFAULT_STALE_TIME,
    enabled: !!id,
  })

  let goal: GoalSummaryResponse | null

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
