import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useSystems } from './useSystems'
import { getSystemsService } from '@/features/systems/services/get-systems-service'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import type { GetUserSystemsRequest } from '@/features/systems/types/request/get-user-systems'
import { asISODateString, asISOTimestampString } from '@/types/dates'

vi.mock('@/features/systems/services/get-systems-service')

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	})
	return function Wrapper({ children }: { children: ReactNode }) {
		return createElement(QueryClientProvider, { client: queryClient }, children)
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

// ─── useSystems ───────────────────────────────────────────────────────────────

describe('useSystems', () => {
	it('returns the systems array when the service responds successfully', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [mockSystem],
		})

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(result.current.systems).toEqual([mockSystem])
		expect(result.current.error).toBeNull()
	})

	it('returns an empty array when the service responds with ok: false', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: false, message: 'Unauthorized', status: 401,
			error: { code: 'UNAUTHORIZED', details: {} },
		})

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(result.current.systems).toEqual([])
	})

	it('returns an empty array and sets error when the service throws', async () => {
		vi.mocked(getSystemsService).mockRejectedValue(new Error('Network error'))

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(result.current.systems).toEqual([])
		expect(result.current.error).toBeInstanceOf(Error)
	})

	it('exposes isLoading: true before the query settles', () => {
		vi.mocked(getSystemsService).mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		expect(result.current.isLoading).toBe(true)
		expect(result.current.systems).toEqual([])
	})

	it('exposes a refetch function', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [mockSystem],
		})

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(typeof result.current.refetch).toBe('function')
	})

	it('forwards filters to the service', async () => {
		const filters: GetUserSystemsRequest = {}

		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystems(filters), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(getSystemsService).toHaveBeenCalledWith(filters)
	})

	it('calls the service with undefined when no filters are provided', async () => {
		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [],
		})

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(getSystemsService).toHaveBeenCalledWith(undefined)
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

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(result.current.systems).toHaveLength(2)
		expect(result.current.systems[0].name).toBe('Fitness Routine')
		expect(result.current.systems[1].name).toBe('Meditation Practice')
	})

	it('handles systems with nullable fields', async () => {
		const systemWithoutOptionalFields: SystemSummaryResponse = {
			id: 1,
			name: 'Minimal System',
			description: null,
			symbol: null,
			startingDate: asISODateString('2026-01-01'),
			createdAt: null,
			modifiedAt: null,
			progress: 0,
		}

		vi.mocked(getSystemsService).mockResolvedValue({
			ok: true, message: 'OK', data: [systemWithoutOptionalFields],
		})

		const { result } = renderHook(() => useSystems(), { wrapper: createWrapper() })

		await waitFor(() => expect(result.current.isLoading).toBe(false))

		expect(result.current.systems[0].description).toBeNull()
		expect(result.current.systems[0].symbol).toBeNull()
	})
})
