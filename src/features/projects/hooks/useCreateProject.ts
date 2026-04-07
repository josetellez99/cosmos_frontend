import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateProjectRequest } from '@/features/projects/types/request/create-project'
import type { CreateProjectResponse } from '@/features/projects/types/response/create-project'
import { CreateProjectService } from '@/features/projects/services/create-project-service'
import { projectQueryKeys } from '@/features/projects/helpers/queryKeys'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'
import type { ApiResponse, ErrorApiResponse } from '@/types/api_responses'

type CreateProjectContext = {
  snapshots: Array<[readonly unknown[], ApiResponse<ProjectsSummary[]> | undefined]>
}

export const useCreateProject = () => {

  const queryClient = useQueryClient()

  const { mutate, isPending, error, data } = useMutation<
    CreateProjectResponse,
    ErrorApiResponse,
    CreateProjectRequest,
    CreateProjectContext
  >({

    mutationFn: async (project) => {
      // Throw on !ok so TanStack Query routes the failure to onError instead of
      // onSuccess. This is what makes optimistic-update rollback and form-level
      // error feedback work for every mutation hook in the app.
      const response = await CreateProjectService(project)
      if (!response.ok) {
        throw response
      }
      return response.data
    },

    onMutate: async (newProject) => {
      // Stop any in-flight fetches for project lists — if they landed after our
      // optimistic update they would overwrite it and the UI would flicker
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.lists() })

      // Save a copy of every cached list variant (different filter combinations).
      // We need this so we can undo the optimistic update if the API call fails.
      const snapshots = queryClient.getQueriesData<ApiResponse<ProjectsSummary[]>>({
        queryKey: projectQueryKeys.lists(),
      })

      // Build a fake ProjectsSummary so the UI can render the new item immediately,
      // before the server responds. The negative id flags it as temporary.
      const optimisticProject: ProjectsSummary = {
        id: -Date.now(),          // temporary — replaced by the real id after refetch
        name: newProject.name,
        code: newProject.code,
        startingDate: newProject.startingDate,
        deadline: newProject.deadline,
        status: newProject.status ?? 'not started',
        sortOrder: 0,             // placeholder — corrected after refetch
        progress: 0,              // new project has no progress yet
      }

      // Append the fake project to every cached list variant so all active views
      // show the new item right away, regardless of which filters are applied
      queryClient.setQueriesData<ApiResponse<ProjectsSummary[]>>(
        { queryKey: projectQueryKeys.lists() },
        (old) => {
          if (!old || !old.ok) return old
          return { ...old, data: [...old.data, optimisticProject] }
        }
      )

      // Return the snapshots so onError can access them for rollback
      return { snapshots }
    },

    onError: (_err, _newProject, context) => {
      // The API call failed — put every list back to what it was before onMutate
      context?.snapshots.forEach(([queryKey, snapshot]) => {
        queryClient.setQueryData(queryKey, snapshot)
      })
    },

    onSuccess: () => {
      // The project was saved — invalidate all list variants so they refetch
      // fresh data from the server (real id, correct sortOrder, etc.)
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() })
    },
  })

  return { mutate, isPending, error, data }
}
