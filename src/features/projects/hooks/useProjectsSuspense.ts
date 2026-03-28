import { useSuspenseQuery } from '@tanstack/react-query'
import type { GetProjectsRequest } from '@/features/projects/types/request/get-projects'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'
import { getprojectsService } from '@/features/projects/services/get-projects-service'
import { projectQueryKeys } from '@/features/projects/helpers/queryKeys'
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

export const useProjectsSuspense = (filters?: GetProjectsRequest) => {

  const { data, refetch } = useSuspenseQuery({
    queryKey: projectQueryKeys.list(filters),
    queryFn: () => getprojectsService(filters),
    staleTime: DEFAULT_STALE_TIME,
  })

  let projects: ProjectsSummary[]

  if (data && data.ok) {
    projects = data.data
  } else {
    projects = []
  }

  return {
    projects,
    refetch
  }
}
