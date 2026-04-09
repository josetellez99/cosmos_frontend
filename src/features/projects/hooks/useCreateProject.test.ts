import { renderHook, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { useCreateProject } from "./useCreateProject"
import { CreateProjectService } from "@/features/projects/services/create-project-service"
import { projectQueryKeys } from "@/features/projects/helpers/queryKeys"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import type { ProjectCodeString } from "@/features/projects/types/project-code-string"
import type { ISODateString, ISOTimestampString } from "@/types/dates"
import type { ApiResponse } from "@/types/api_responses"
import type { ProjectsSummary } from "@/features/projects/types/response/projects"

vi.mock("@/features/projects/services/create-project-service")

const mockRequest: CreateProjectRequest = {
    name: "New Project",
    code: "NP-01" as ProjectCodeString,
    startingDate: "2026-05-01" as ISODateString,
    deadline: "2026-12-01T00:00:00Z" as ISOTimestampString,
}

const existingProject: ProjectsSummary = {
    id: 1,
    name: "Existing",
    startingDate: "2026-01-01" as ISODateString,
    deadline: "2026-06-01T00:00:00Z" as ISOTimestampString,
    status: "in progress",
    code: "EX-01",
    sortOrder: 1,
    progress: 50,
}

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
    })
    return { queryClient, Wrapper }

    function Wrapper({ children }: { children: ReactNode }) {
        return createElement(QueryClientProvider, { client: queryClient }, children)
    }
}

afterEach(() => vi.restoreAllMocks())

describe("useCreateProject", () => {
    it("calls CreateProjectService and returns data on success", async () => {
        vi.mocked(CreateProjectService).mockResolvedValue({
            ok: true,
            message: "Created",
            data: { id: 42 },
        })

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateProject(), { wrapper: Wrapper })

        act(() => {
            result.current.mutate(mockRequest)
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(CreateProjectService).toHaveBeenCalledWith(mockRequest)
        expect(result.current.data).toEqual({ id: 42 })
    })

    it("sets error when the service responds with ok: false", async () => {
        const errorResponse = {
            ok: false as const,
            message: "Validation failed",
            status: 400,
            error: { code: "VALIDATION_ERROR", details: {} },
        }
        vi.mocked(CreateProjectService).mockResolvedValue(errorResponse)

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateProject(), { wrapper: Wrapper })

        act(() => {
            result.current.mutate(mockRequest)
        })

        await waitFor(() => expect(result.current.error).not.toBeNull())

        expect(result.current.error).toMatchObject({ message: "Validation failed" })
    })

    it("optimistically adds the new project to cached lists", async () => {
        // Never resolve — we want to inspect the cache while the mutation is pending
        vi.mocked(CreateProjectService).mockReturnValue(new Promise(() => {}))

        const { queryClient, Wrapper } = createWrapper()

        // Seed the cache with an existing list using the exact key shape the hook matches
        const listKey = projectQueryKeys.list()
        const cachedList: ApiResponse<ProjectsSummary[]> = {
            ok: true,
            message: "OK",
            data: [existingProject],
        }
        queryClient.setQueryData(listKey, cachedList)

        const { result } = renderHook(() => useCreateProject(), { wrapper: Wrapper })

        await act(async () => {
            result.current.mutate(mockRequest)
        })

        // onMutate uses getQueriesData with the lists() prefix, which matches list() keys
        const entries = queryClient.getQueriesData<ApiResponse<ProjectsSummary[]>>({
            queryKey: projectQueryKeys.lists(),
        })
        expect(entries.length).toBeGreaterThan(0)
        const [, cached] = entries[0]
        expect(cached?.ok).toBe(true)
        if (cached?.ok) {
            expect(cached.data).toHaveLength(2)
            expect(cached.data[1].name).toBe("New Project")
        }
    })

    it("rolls back the optimistic update on error", async () => {
        vi.mocked(CreateProjectService).mockResolvedValue({
            ok: false,
            message: "Server error",
            status: 500,
            error: { code: "INTERNAL_ERROR", details: {} },
        })

        // Use Infinity gcTime so cache entries survive long enough to inspect after rollback
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false, gcTime: Infinity },
                mutations: { retry: false },
            },
        })
        function RollbackWrapper({ children }: { children: ReactNode }) {
            return createElement(QueryClientProvider, { client: queryClient }, children)
        }

        const listKey = projectQueryKeys.list()
        const cachedList: ApiResponse<ProjectsSummary[]> = {
            ok: true,
            message: "OK",
            data: [existingProject],
        }
        queryClient.setQueryData(listKey, cachedList)

        const { result } = renderHook(() => useCreateProject(), { wrapper: RollbackWrapper })

        await act(async () => {
            result.current.mutate(mockRequest)
        })

        await waitFor(() => expect(result.current.error).not.toBeNull())

        // Cache should be restored to the original snapshot
        const cached = queryClient.getQueryData<ApiResponse<ProjectsSummary[]>>(listKey)
        expect(cached?.ok).toBe(true)
        if (cached?.ok) {
            expect(cached.data).toHaveLength(1)
            expect(cached.data[0].name).toBe("Existing")
        }
    })

    it("invalidates list queries on success", async () => {
        vi.mocked(CreateProjectService).mockResolvedValue({
            ok: true,
            message: "Created",
            data: { id: 42 },
        })

        const { queryClient, Wrapper } = createWrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useCreateProject(), { wrapper: Wrapper })

        act(() => {
            result.current.mutate(mockRequest)
        })

        await waitFor(() => expect(result.current.isPending).toBe(false))

        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: projectQueryKeys.lists() })
        )
    })

    it("exposes isPending: true while the mutation is in flight", async () => {
        vi.mocked(CreateProjectService).mockReturnValue(new Promise(() => {}))

        const { Wrapper } = createWrapper()
        const { result } = renderHook(() => useCreateProject(), { wrapper: Wrapper })

        await act(async () => {
            result.current.mutate(mockRequest)
        })

        await waitFor(() => expect(result.current.isPending).toBe(true))
    })
})
