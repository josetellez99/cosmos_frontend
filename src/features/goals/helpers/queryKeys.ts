import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'

export const goalQueryKeys = {
  all: ['goals'] as const,
  lists: () => [...goalQueryKeys.all, 'list'] as const,
  list: (filters?: GetUserGoalsRequest) =>
    [...goalQueryKeys.lists(), { filters }] as const,
  details: () => [...goalQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...goalQueryKeys.details(), id] as const,
}