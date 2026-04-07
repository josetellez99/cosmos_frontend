import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, ErrorApiResponse } from '@/types/api_responses'
import { updateGoalLinkService } from '@/features/goalLink/services/update-goal-link-service'
import { goalQueryKeys } from '@/features/goals/helpers/queryKeys'
import type { GoalDetailsResponse } from '@/features/goals/types/response/goal-details'

interface UpdateGoalLinkVariables {
    // Identifies which goals_subitems row to update.
    subitemId: number
    // The goal that owns the subitem — needed because goalLink rows have no
    // independent cache. The detail cache for this goal is the only place
    // the new weight needs to land.
    goalId: number
    subitemWeight: number
}

type GoalDetailCache = ApiResponse<GoalDetailsResponse>

interface UpdateGoalLinkContext {
    snapshot: GoalDetailCache | undefined
}

export const useUpdateGoalLink = () => {

    const queryClient = useQueryClient()

    const { mutate, isPending, error, data } = useMutation<
        void,
        ErrorApiResponse,
        UpdateGoalLinkVariables,
        UpdateGoalLinkContext
    >({

        mutationFn: async ({ subitemId, subitemWeight }) => {
            // Throw on !ok so TanStack Query routes the failure to onError
            // instead of onSuccess. Same convention as every other mutation hook.
            const response = await updateGoalLinkService(subitemId, { subitemWeight })
            if (!response.ok) {
                throw response
            }
        },

        onMutate: async ({ subitemId, goalId, subitemWeight }) => {
            // Stop any in-flight goal-detail fetches that could otherwise land
            // after our optimistic write and clobber it.
            await queryClient.cancelQueries({ queryKey: goalQueryKeys.detail(goalId) })

            // Snapshot the cache for the affected goal so onError can roll back.
            // goalLink rows live nested inside the goal detail — there is no
            // separate goalLink cache to touch.
            const snapshot = queryClient.getQueryData<GoalDetailCache>(
                goalQueryKeys.detail(goalId),
            )

            // Optimistically rewrite the matching subitem's weight inside the
            // cached goal detail. The modal reads from this cache via
            // useGoalSuspense, so the new value paints immediately.
            queryClient.setQueryData<GoalDetailCache>(
                goalQueryKeys.detail(goalId),
                (old) => {
                    if (!old || !old.ok) return old
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            subitems: old.data.subitems.map(subitem =>
                                subitem.id === subitemId
                                    ? { ...subitem, subitemWeight }
                                    : subitem,
                            ),
                        },
                    }
                },
            )

            return { snapshot }
        },

        onError: (_err, { goalId }, context) => {
            // Restore the snapshot for the affected goal.
            if (context?.snapshot !== undefined) {
                queryClient.setQueryData(goalQueryKeys.detail(goalId), context.snapshot)
            }
        },

        onSuccess: (_data, { goalId }) => {
            // Refetch the goal detail so the local cache matches the server
            // (in case the backend recalculated something we didn't predict).
            queryClient.invalidateQueries({ queryKey: goalQueryKeys.detail(goalId) })
        },
    })

    return { mutate, isPending, error, data }
}
