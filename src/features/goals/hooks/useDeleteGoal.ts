import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

// Service function for deleting a goal - to be implemented in goals service
const deleteGoalService = async (_id: number) => {
  // This will be implemented when the backend endpoint is ready
  throw new Error('deleteGoalService not yet implemented')
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGoalService,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: goalQueryKeys.details() })

      // Snapshot the previous value for list
      const previousGoals = queryClient.getQueryData<GoalSummaryResponse[]>(
        goalQueryKeys.list()
      )

      // Snapshot the previous value for detail
      const previousGoal = queryClient.getQueryData<GoalSummaryResponse>(
        goalQueryKeys.detail(id)
      )

      // Optimistically update list (remove the goal)
      if (previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), (old: GoalSummaryResponse[] | undefined) =>
          (old || []).filter((goal) => goal.id !== id)
        )
      }

      // Remove detail query
      queryClient.removeQueries({ queryKey: goalQueryKeys.detail(id) })

      return { previousGoals, previousGoal }
    },
    onError: (_err, id, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), context.previousGoals)
      }
      if (context?.previousGoal) {
        queryClient.setQueryData(goalQueryKeys.detail(id), context.previousGoal)
      }
    },
    onSuccess: (_data, id) => {
      // Remove detail query on success
      queryClient.removeQueries({ queryKey: goalQueryKeys.detail(id) })
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: goalQueryKeys.lists() })
    },
  })
}
