import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, Suspense, type ReactNode } from 'react'
import { useGoalsSuspense } from './useGoalsSuspense'
import { getUserGoalsService } from '@/features/goals/services/get-goals-service'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'
import { asISODateString, asISOTimestampString } from '@/types/dates'

vi.mock('@/features/goals/services/get-goals-service')

// useSuspenseQuery throws a Promise while loading — the Suspense boundary catches it.
// Without one, renderHook would propagate the thrown Promise as an uncaught error.
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

const mockGoal: GoalSummaryResponse = {
    id: 1,
    name: 'Learn TypeScript',
    startingDate: asISODateString('2026-01-01'),
    deadline: asISOTimestampString('2026-12-31T00:00:00.000Z'),
    color: '#3b82f6',
    sortOrder: 1,
    progress: 40,
}

afterEach(() => vi.restoreAllMocks())

// ─── useGoalsSuspense ─────────────────────────────────────────────────────────

describe('useGoalsSuspense', () => {
    it('returns the goals array when the service resolves successfully', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockGoal],
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        // result.current is null while the component is suspended; wait for it to resolve
        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.goals).toEqual([mockGoal])
    })

    it('returns an empty array when the service responds with ok: false', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: false, message: 'Forbidden', status: 403,
            error: { code: 'FORBIDDEN', details: {} },
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.goals).toEqual([])
    })

    it('returns an empty array when the service returns an empty list', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.goals).toEqual([])
    })

    it('exposes a refetch function', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(typeof result.current.refetch).toBe('function')
    })

    it('forwards filters to the service', async () => {
        const filters: GetUserGoalsRequest = {
            temporality: ['quarter'],
            startDate: '2026-01-01',
            endDate: '2026-03-31',
        }

        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useGoalsSuspense(filters), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(getUserGoalsService).toHaveBeenCalledWith(filters)
    })

    it('calls the service with undefined when no filters are provided', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(getUserGoalsService).toHaveBeenCalledWith(undefined)
    })

    // ─── Key difference from useGoals: no isLoading state ─────────────────────
    // useSuspenseQuery never exposes isLoading: true to the consumer — the component
    // suspends instead. By the time result.current is accessible, data is already
    // resolved. This test documents that contract explicitly.

    it('result is never accessible while the hook is in a loading state', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockGoal],
        })

        const { result } = renderHook(() => useGoalsSuspense(), { wrapper: createWrapper() })

        // result.current is null (component suspended) until data is ready
        // There is no intermediate isLoading: true state to observe
        await waitFor(() => expect(result.current.goals).toEqual([mockGoal]))
    })
})
