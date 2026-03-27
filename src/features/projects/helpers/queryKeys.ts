import type { GetProjectsRequest } from '@/features/projects/types/request/get-projects'

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filters?: GetProjectsRequest) =>
    [...projectQueryKeys.lists(), { filters }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectQueryKeys.details(), id] as const,
}