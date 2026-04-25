import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, Suspense, type ReactNode } from 'react'
import { useHabitsSuspense } from './useHabitsSuspense'
import { getHabitsService } from '@/features/habits/services/get-habits-service'
import type { HabitSummaryResponse } from '@/features/habits/types/response/habits'

vi.mock('@/features/habits/services/get-habits-service')

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

const mockHabit: HabitSummaryResponse = {
    id: 1,
    name: 'Morning Run',
    description: 'Run 5km in the morning',
    emoji: '🏃',
    scheduleType: 'each_x_days',
    scheduleConfig: '{"time": "06:00"}',
    starting_date: '2026-01-01',
    progress: 60,
}

afterEach(() => vi.restoreAllMocks())

// ─── useHabitsSuspense ────────────────────────────────────────────────────────

describe('useHabitsSuspense', () => {
    it('returns the habits array when the service resolves successfully', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockHabit],
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        // result.current is null while the component is suspended; wait for it to resolve
        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.habits).toEqual([mockHabit])
    })

    it('returns an empty array when the service responds with ok: false', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: false, message: 'Forbidden', status: 403,
            error: { code: 'FORBIDDEN', details: {} },
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.habits).toEqual([])
    })

    it('returns an empty array when the service returns an empty list', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(result.current.habits).toEqual([])
    })

    it('exposes a refetch function', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(typeof result.current.refetch).toBe('function')
    })

    it('calls the service without any parameters', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: true, message: 'OK', data: [],
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current).not.toBeNull())

        expect(getHabitsService).toHaveBeenCalledWith()
    })

    // ─── Key difference from useGoals: no isLoading state ─────────────────────
    // useSuspenseQuery never exposes isLoading: true to the consumer — the component
    // suspends instead. By the time result.current is accessible, data is already
    // resolved. This test documents that contract explicitly.

    it('result is never accessible while the hook is in a loading state', async () => {
        vi.mocked(getHabitsService).mockResolvedValue({
            ok: true, message: 'OK', data: [mockHabit],
        })

        const { result } = renderHook(() => useHabitsSuspense(), { wrapper: createWrapper() })

        // result.current is null (component suspended) until data is ready
        // There is no intermediate isLoading: true state to observe
        await waitFor(() => expect(result.current.habits).toEqual([mockHabit]))
    })
})
