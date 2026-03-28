import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useProjects } from './useProjects'
import { getprojectsService } from '@/features/projects/services/get-projects-service'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'
import type { GetProjectsRequest } from '@/features/projects/types/request/get-projects'
import { asISODateString, asISOTimestampString } from '@/types/dates'

vi.mock('@/features/projects/services/get-projects-service')

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    return function Wrapper({ children }: { children: ReactNode }) {
        return createElement(QueryClientProvider, { client: queryClient }, children)
    }
}

const mockProject: ProjectsSummary = {
    id: 1,
    name: 'Cosmos Frontend',
    startingDate: asISODateString('2026-01-01'),
    deadline: asISOTimestampString('2026-06-30T00:00:00.000Z'),
    status: 'in progress',
    code: 'COS',
    sortOrder: 1,
    progress: 45,
}

afterEach(() => vi.restoreAllMocks())

// ─── useProjects ─────────────────────────────────────────────────────────────

describe('useProjects', () => {
    it('returns the projects array when the service responds successfully', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockProject],
        })

        const { result } = renderHook(() => useProjects({}), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.projects).toEqual([mockProject])
        expect(result.current.error).toBeNull()
    })

    it('returns an empty array when the service responds with ok: false', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: false, message: 'Unauthorized', status: 401,
            error: { code: 'UNAUTHORIZED', details: {} },
        })

        const { result } = renderHook(() => useProjects({}), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.projects).toEqual([])
    })

    it('returns an empty array and sets error when the service throws', async () => {
        vi.mocked(getprojectsService).mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useProjects({}), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.projects).toEqual([])
        expect(result.current.error).toBeInstanceOf(Error)
    })

    it('exposes isLoading: true before the query settles', () => {
        vi.mocked(getprojectsService).mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useProjects({}), { wrapper: createWrapper() })

        expect(result.current.isLoading).toBe(true)
        expect(result.current.projects).toEqual([])
    })

    it('exposes a refetch function', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockProject],
        })

        const { result } = renderHook(() => useProjects({}), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(typeof result.current.refetch).toBe('function')
    })

    it('forwards filters to the service', async () => {
        const filters: GetProjectsRequest = {
            status: ['in progress'],
            orderBy: 'sort_order',
            order: 'ASC',
        }

        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useProjects(filters), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(getprojectsService).toHaveBeenCalledWith(filters)
    })
})
