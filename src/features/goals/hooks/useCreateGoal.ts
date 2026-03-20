import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

// Service function for creating a goal - to be implemented in goals service
// For now, this is a placeholder that will be replaced with the actual service
const createGoalService = async (_goal: Partial<GoalSummaryResponse>) => {
  // This will be implemented when the backend endpoint is ready
  throw new Error('createGoalService not yet implemented')
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoalService,
    onMutate: async (newGoal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: goalQueryKeys.lists() })

      // Snapshot the previous value
      const previousGoals = queryClient.getQueryData<GoalSummaryResponse[]>(
        goalQueryKeys.list()
      )

      // Optimistically update to the new value
      if (previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), (old: GoalSummaryResponse[] | undefined) => [
          ...(old || []),
          { ...newGoal, id: Math.random() } as GoalSummaryResponse,
        ])
      }

      return { previousGoals }
    },
    onError: (_err, _newGoal, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), context.previousGoals)
      }
    },
    onSuccess: () => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: goalQueryKeys.lists() })
    },
  })
}
