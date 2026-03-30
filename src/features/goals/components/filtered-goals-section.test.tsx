import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { server } from '@/tests/mocks/server'
import { FilteredGoalsSection } from './filtered-goals-section'
import { asISODateString, asISOTimestampString } from '@/types/dates'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'

const GOALS_URL = 'http://localhost:8080/api/v1/goals'

// ─── Wrapper ──────────────────────────────────────────────────────────────────
// FilteredGoalsSection uses useSuspenseQuery (via useGoals) and GoalItem (uses Link).
// It needs both QueryClientProvider and MemoryRouter.

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

const mockGoal: GoalSummaryResponse = {
    id: 1,
    name: 'Aprende React Testing Library',
    startingDate: asISODateString('2026-01-01'),
    deadline: asISOTimestampString('2026-12-31T00:00:00.000Z'),
    color: '#3b82f6',
    sortOrder: 1,
    progress: 50,
    status: 'in progress',
    temporality: 'semester',
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('FilteredGoalsSection — rendering', () => {
    it('renders the filters trigger button', async () => {
        server.use(http.get(GOALS_URL, () => HttpResponse.json({ message: 'OK', data: [] })))

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        expect(screen.getByText('Filtros')).toBeInTheDocument()
    })

    it('shows goals after the query resolves successfully', async () => {
        server.use(
            http.get(GOALS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [mockGoal] })
            )
        )

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText('Aprende React Testing Library')).toBeInTheDocument()
        })
    })

    it('shows the fallback message when the server returns an empty list', async () => {
        server.use(http.get(GOALS_URL, () => HttpResponse.json({ message: 'OK', data: [] })))

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(
                screen.getByText(/no has creado ninguna meta/i)
            ).toBeInTheDocument()
        })
    })
})

// ─── Loading state ────────────────────────────────────────────────────────────

describe('FilteredGoalsSection — loading state', () => {
    it('does not render goal content while the query is still pending', () => {
        // Never resolve so the component stays suspended
        server.use(http.get(GOALS_URL, async () => delay('infinite')))

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        // Goals are not rendered during loading
        expect(screen.queryByText('Aprende React Testing Library')).not.toBeInTheDocument()
    })
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('FilteredGoalsSection — edge cases', () => {
    it('renders multiple goals correctly', async () => {
        const secondGoal: GoalSummaryResponse = {
            ...mockGoal,
            id: 2,
            name: 'Ship Cosmos V1',
        }

        server.use(
            http.get(GOALS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [mockGoal, secondGoal] })
            )
        )

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText('Aprende React Testing Library')).toBeInTheDocument()
            expect(screen.getByText('Ship Cosmos V1')).toBeInTheDocument()
        })
    })

    it('shows fallback instead of crashing when the API returns ok: false', async () => {
        // apiClient catches HTTP errors and returns { ok: false } — the hook maps
        // that to an empty goals array, so the fallback message is shown
        server.use(
            http.get(GOALS_URL, () =>
                HttpResponse.json(
                    { message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
                    { status: 401 }
                )
            )
        )

        render(<FilteredGoalsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText(/no has creado ninguna meta/i)).toBeInTheDocument()
        })
    })
})
