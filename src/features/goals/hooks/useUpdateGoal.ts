import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'

interface UpdateGoalRequest {
  id: number
  updates: Partial<GoalSummaryResponse>
}

// Service function for updating a goal - to be implemented in goals service
const updateGoalService = async (_: UpdateGoalRequest) => {
  // This will be implemented when the backend endpoint is ready
  throw new Error('updateGoalService not yet implemented')
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGoalService,
    onMutate: async ({ id, updates }) => {
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

      // Optimistically update list
      if (previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), (old: GoalSummaryResponse[] | undefined) =>
          (old || []).map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          )
        )
      }

      // Optimistically update detail
      if (previousGoal) {
        queryClient.setQueryData(goalQueryKeys.detail(id), {
          ...previousGoal,
          ...updates,
        })
      }

      return { previousGoals, previousGoal }
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData(goalQueryKeys.list(), context.previousGoals)
      }
      if (context?.previousGoal) {
        queryClient.setQueryData(goalQueryKeys.detail(id), context.previousGoal)
      }
    },
    onSuccess: (_data, { id }) => {
      // Invalidate detail to refetch
      queryClient.invalidateQueries({ queryKey: goalQueryKeys.detail(id) })
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: goalQueryKeys.lists() })
    },
  })
}
