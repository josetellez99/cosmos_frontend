import { useSuspenseQuery } from '@tanstack/react-query'
import type { GoalDetailsResponse } from '@/features/goals/types/response/goal-details'
import { getGoalService } from '@/features/goals/services/get-goal-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'
import type { GetGoalRequest } from '@/features/goals/types/request/get-goal'

export const useGoalSuspense = (id: number, req?: GetGoalRequest) => {

  const { data, error, refetch } = useSuspenseQuery({
    queryKey: goalQueryKeys.detail(id),
    queryFn: () => getGoalService(id, req),
    staleTime: DEFAULT_STALE_TIME,
  })

  if (!data.ok) {
    throw new Error(data.message ?? "No se pudo cargar la meta")
  }

  const goal: GoalDetailsResponse = data.data

  return {
    goal,
    error,
    refetch,
  }
}
