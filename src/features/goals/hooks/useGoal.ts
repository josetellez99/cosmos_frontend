import { useQuery } from '@tanstack/react-query'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

// Service function for fetching a single goal - to be implemented in goals service
const getGoalService = async (_id: number): Promise<GoalSummaryResponse> => {
  // This will be implemented when the backend endpoint is ready
  throw new Error('getGoalService not yet implemented')
}

export const useGoal = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: goalQueryKeys.detail(id),
    queryFn: () => getGoalService(id),
    enabled: !!id, // Only fetch if id is provided
  })

  return {
    goal: data ?? null,
    isLoading,
    error,
    refetch,
  }
}
