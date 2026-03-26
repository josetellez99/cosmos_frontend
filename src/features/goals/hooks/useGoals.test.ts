import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode, Suspense } from 'react'
import { useGoals } from './useGoals'
import { getUserGoalsService } from '@/features/goals/services/get-goals-service'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'
import { asISODateString, asISOTimestampString } from '@/types/dates'

// Replace the real HTTP service with a mock — tests control what the API returns
vi.mock('@/features/goals/services/get-goals-service')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createWrapper(withSuspense = false) {
    // Fresh QueryClient per test: no stale cache, no automatic retries that hang tests
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
        },
    })

    return function Wrapper({ children }: { children: ReactNode }) {
        const inner = withSuspense
            ? createElement(Suspense, { fallback: null }, children)
            : children
        return createElement(QueryClientProvider, { client: queryClient }, inner)
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

afterEach(() => {
    vi.restoreAllMocks()
})

// ─── useGoals (useSuspense: false) ───────────────────────────────────────────

describe('useGoals — useQuery mode (useSuspense: false)', () => {
    it('returns the goals array when the service responds successfully', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [mockGoal],
        })

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.goals).toEqual([mockGoal])
        expect(result.current.error).toBeNull()
    })

    it('returns an empty array when the service responds with ok: false', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: false,
            message: 'Unauthorized',
            status: 401,
            error: { code: 'UNAUTHORIZED', details: {} },
        })

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.goals).toEqual([])
    })

    it('returns an empty array when the service throws (network error)', async () => {
        vi.mocked(getUserGoalsService).mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.goals).toEqual([])
        expect(result.current.error).toBeInstanceOf(Error)
    })

    it('exposes isLoading: true before the query settles', () => {
        // Return a promise that never resolves so the hook stays in loading state
        vi.mocked(getUserGoalsService).mockReturnValue(new Promise(() => {}))

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        expect(result.current.isLoading).toBe(true)
        expect(result.current.goals).toEqual([])
    })

    it('exposes a refetch function', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [mockGoal],
        })

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(typeof result.current.refetch).toBe('function')
    })

    it('forwards filters to the service', async () => {
        const filters: GetUserGoalsRequest = {
            temporality: ['month'],
            startDate: '2026-03-01',
            endDate: '2026-03-31',
        }

        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [],
        })

        const { result } = renderHook(() => useGoals(false, filters), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(getUserGoalsService).toHaveBeenCalledWith(filters)
    })

    it('calls the service with undefined when no filters are provided', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [],
        })

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(getUserGoalsService).toHaveBeenCalledWith(undefined)
    })

    it('returns empty array when the response data is an empty list', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [],
        })

        const { result } = renderHook(() => useGoals(false), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.goals).toEqual([])
    })
})

// ─── useGoals (useSuspense: true) ────────────────────────────────────────────

describe('useGoals — useSuspenseQuery mode (useSuspense: true)', () => {
    it('returns goals when the service resolves successfully', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: true,
            message: 'OK',
            data: [mockGoal],
        })

        // useSuspenseQuery throws a Promise while loading — the Suspense boundary catches it
        const { result } = renderHook(() => useGoals(true), {
            wrapper: createWrapper(true),
        })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.goals).toEqual([mockGoal])
    })

    it('returns an empty array when service responds with ok: false', async () => {
        vi.mocked(getUserGoalsService).mockResolvedValue({
            ok: false,
            message: 'Forbidden',
            status: 403,
            error: { code: 'FORBIDDEN', details: {} },
        })

        const { result } = renderHook(() => useGoals(true), {
            wrapper: createWrapper(true),
        })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.goals).toEqual([])
    })
})
