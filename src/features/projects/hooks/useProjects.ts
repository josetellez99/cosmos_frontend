import { useQuery } from "@tanstack/react-query";
import type { GetProjectsRequest } from "@/features/projects/types/request/get-projects";
import { getprojectsService } from "@/features/projects/services/get-projects-service";
import { projectQueryKeys } from "@/features/projects/helpers/queryKeys";
import type { ProjectsSummary } from "@/features/projects/types/response/projects";
import { DEFAULT_STALE_TIME } from '@/lib/constants/global_constants'

export const useProjects = (filters: GetProjectsRequest) => {

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: projectQueryKeys.list(filters),
    queryFn: () => getprojectsService(filters),
    staleTime: DEFAULT_STALE_TIME,
  });

  let projects: ProjectsSummary[];

  if (data && data.ok) {
    projects = data.data;
  } else {
    projects = [];
  }

  return {
    projects,
    isLoading,
    error,
    refetch
  }
};
