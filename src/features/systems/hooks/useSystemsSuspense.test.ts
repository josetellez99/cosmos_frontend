import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, Suspense, type ReactNode } from 'react'
import { useSystemsSuspense } from './useSystemsSuspense'
import { getSystemsService } from '@/features/systems/services/get-systems-service'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import type { GetUserSystemsRequest } from '@/features/systems/types/request/get-user-systems'
import { asISODateString, asISOTimestampString } from '@/types/dates'

vi.mock('@/features/systems/services/get-systems-service')

// useSystemsSuspenseQuery throws a Promise while loading — the Suspense boundary catches it.
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

const mockSystem: SystemSummaryResponse = {
	id: 1,
	name: 'Fitness Routine',
	description: 'Daily exercise and health tracking',
	symbol: '💪',
	startingDate: asISODateString('2026-01-01'),
	createdAt: asISOTimestampString('2026-01-01T10:00:00.000Z'),
	modifiedAt: asISOTimestampString('2026-03-15T14:30:00.000Z'),
	progress: 65,
}

afterEach(() => vi.restoreAllMocks())

// ─── useSystemsSuspense ───────────────────────────────────────────────────────

describe('useSystemsSuspense', () => {
	it('returns the systems array when the service resolves successfully', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [mockSystem],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		// result.current is null while the component is suspended; wait for it to resolve
		await waitFor(() => expect(result.current).not.toBeNull())

		expect(result.current.systems).toEqual([mockSystem])
	})

	it('returns an empty array when the service responds with ok: false', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: false, message: 'Forbidden', status: 403,
			error: { code: 'FORBIDDEN', details: {} },
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(result.current.systems).toEqual([])
	})

	it('returns an empty array when the service returns an empty list', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(result.current.systems).toEqual([])
	})

	it('exposes a refetch function', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(typeof result.current.refetch).toBe('function')
	})

	it('forwards filters to the service', async () => {
		const filters: GetUserSystemsRequest = {}

		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystemsSuspense(filters), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(getSystemsService).toHaveBeenCalledWith(filters)
	})

	it('calls the service with undefined when no filters are provided', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(getSystemsService).toHaveBeenCalledWith(undefined)
	})

	// ─── Key difference from useSystems: no isLoading state ─────────────────────
	// useSuspenseQuery never exposes isLoading: true to the consumer — the component
	// suspends instead. By the time result.current is accessible, data is already
	// resolved. This test documents that contract explicitly.

	it('result is never accessible while the hook is in a loading state', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [mockSystem],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		// result.current is null (component suspended) until data is ready
		// There is no intermediate isLoading: true state to observe
		await waitFor(() => expect(result.current.systems).toEqual([mockSystem]))
	})

	it('returns multiple systems correctly', async () => {
		const system2: SystemSummaryResponse = {
			...mockSystem,
			id: 2,
			name: 'Meditation Practice',
			symbol: '🧘',
			progress: 45,
		}

		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [mockSystem, system2],
		})

		const { result } = renderHook(() => useSystemsSuspense(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current).not.toBeNull())

		expect(result.current.systems).toHaveLength(2)
		expect(result.current.systems[0].name).toBe('Fitness Routine')
		expect(result.current.systems[1].name).toBe('Meditation Practice')
	})
})
