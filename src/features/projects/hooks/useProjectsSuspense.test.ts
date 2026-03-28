import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, Suspense, type ReactNode } from 'react'
import { useProjectsSuspense } from './useProjectsSuspense'
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
        return createElement(
            QueryClientProvider,
            { client: queryClient },
            createElement(Suspense, { fallback: null }, children)
        )
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

// ─── useProjectsSuspense ─────────────────────────────────────────────────────

describe('useProjectsSuspense', () => {
    it('returns the projects array when the service resolves successfully', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockProject],
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.projects).toEqual([mockProject])
    })

    it('returns an empty array when the service responds with ok: false', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: false, message: 'Forbidden', status: 403,
            error: { code: 'FORBIDDEN', details: {} },
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.projects).toEqual([])
    })

    it('returns an empty array when the service returns an empty list', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.projects).toEqual([])
    })

    it('exposes a refetch function', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

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

        const { result } = renderHook(() => useProjectsSuspense(filters), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(getprojectsService).toHaveBeenCalledWith(filters)
    })

    it('calls the service with undefined when no filters are provided', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(getprojectsService).toHaveBeenCalledWith(undefined)
    })

    it('result is never accessible while the hook is in a loading state', async () => {
        vi.mocked(getprojectsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockProject],
        })

        const { result } = renderHook(() => useProjectsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.projects).toEqual([mockProject]))
    })
})
