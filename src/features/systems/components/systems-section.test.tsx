import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { server } from '@/tests/mocks/server'
import { SystemsSection } from './systems-section'
import { asISODateString, asISOTimestampString } from '@/types/dates'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'

const SYSTEMS_URL = 'http://localhost:8080/api/v1/systems'

// ─── Wrapper ──────────────────────────────────────────────────────────────────
// SystemsSection uses useSystemsSuspense and SystemsList (no routing needed).
// It needs QueryClientProvider for the hook to work.

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	})
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>{children}</MemoryRouter>
			</QueryClientProvider>
		)
	}
}

// ─── Mock data ────────────────────────────────────────────────────────────────

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

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('SystemsSection — rendering', () => {
	it('shows systems after the query resolves successfully', async () => {
		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [mockSystem] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
		})
	})

	it('shows the fallback message when the server returns an empty list', async () => {
		server.use(http.get(SYSTEMS_URL, () => HttpResponse.json({ message: 'OK', data: [] })))

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(
				screen.getByText(/no tienes sistemas creados/i)
			).toBeInTheDocument()
		})
	})

	it('renders systems in a list structure', async () => {
		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [mockSystem] })
			)
		)

		const { container } = render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
		})

		const ul = container.querySelector('ul')
		expect(ul).toBeInTheDocument()
	})
})

// ─── Loading state ────────────────────────────────────────────────────────────

describe('SystemsSection — loading state', () => {
	it('does not render system content while the query is still pending', () => {
		// Never resolve so the component stays suspended
		server.use(http.get(SYSTEMS_URL, async () => delay('infinite')))

		render(<SystemsSection />, { wrapper: createWrapper() })

		// Systems are not rendered during loading
		expect(screen.queryByText('Fitness Routine')).not.toBeInTheDocument()
		// Fallback message also should not be rendered yet
		expect(screen.queryByText(/no tienes sistemas/i)).not.toBeInTheDocument()
	})
})

// ─── Multiple systems ─────────────────────────────────────────────────────────

describe('SystemsSection — multiple systems', () => {
	it('renders multiple systems correctly', async () => {
		const secondSystem: SystemSummaryResponse = {
			...mockSystem,
			id: 2,
			name: 'Meditation Practice',
			symbol: '🧘',
			progress: 45,
		}

		const thirdSystem: SystemSummaryResponse = {
			...mockSystem,
			id: 3,
			name: 'Study System',
			symbol: '📚',
			progress: 70,
		}

		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [mockSystem, secondSystem, thirdSystem] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
			expect(screen.getByText('Meditation Practice')).toBeInTheDocument()
			expect(screen.getByText('Study System')).toBeInTheDocument()
		})
	})

	it('renders systems in the order returned from the API', async () => {
		const systems: SystemSummaryResponse[] = [
			{ ...mockSystem, id: 1, name: 'First System' },
			{ ...mockSystem, id: 2, name: 'Second System' },
			{ ...mockSystem, id: 3, name: 'Third System' },
		]

		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: systems })
			)
		)

		const { container } = render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('First System')).toBeInTheDocument()
		})

		const items = container.querySelectorAll('li')
		expect(items).toHaveLength(3)
		expect(items[0].textContent).toContain('First System')
		expect(items[1].textContent).toContain('Second System')
		expect(items[2].textContent).toContain('Third System')
	})
})

// ─── Error handling ────────────────────────────────────────────────────────────

describe('SystemsSection — error handling', () => {
	it('shows the fallback message when the API returns an error', async () => {
		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json(
					{ message: 'Server Error', error: { code: 'INTERNAL_ERROR', details: {} } },
					{ status: 500 }
				)
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(
				screen.getByText(/no tienes sistemas creados/i)
			).toBeInTheDocument()
		})
	})

	it('handles network errors gracefully', async () => {
		server.use(
			http.get(SYSTEMS_URL, () => HttpResponse.error())
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(
				screen.getByText(/no tienes sistemas creados/i)
			).toBeInTheDocument()
		})
	})
})

// ─── Data with nullable fields ────────────────────────────────────────────────

describe('SystemsSection — nullable fields', () => {
	it('renders systems with null description and symbol', async () => {
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

		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [systemWithoutOptionalFields] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Minimal System')).toBeInTheDocument()
		})
	})
})

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe('SystemsSection — edge cases', () => {
	it('renders a system with zero progress', async () => {
		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [{ ...mockSystem, progress: 0 }] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
		})
	})

	it('renders a system with 100% progress', async () => {
		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [{ ...mockSystem, progress: 100 }] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
		})
	})

	it('renders systems with very long names', async () => {
		const longNameSystem: SystemSummaryResponse = {
			...mockSystem,
			name: 'This is an incredibly long system name that goes on and on and might cause layout issues if not properly handled',
		}

		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: [longNameSystem] })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText(/This is an incredibly long system name/)).toBeInTheDocument()
		})
	})

	it('handles a large number of systems', async () => {
		const manySystems = Array.from({ length: 50 }, (_, i) => ({
			...mockSystem,
			id: i + 1,
			name: `System ${i + 1}`,
		}))

		server.use(
			http.get(SYSTEMS_URL, () =>
				HttpResponse.json({ message: 'OK', data: manySystems })
			)
		)

		render(<SystemsSection />, { wrapper: createWrapper() })

		await waitFor(() => {
			expect(screen.getByText('System 1')).toBeInTheDocument()
			expect(screen.getByText('System 50')).toBeInTheDocument()
		})
	})
})
