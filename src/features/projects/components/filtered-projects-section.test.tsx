import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { server } from '@/tests/mocks/server'
import { FilteredProjectsSection } from './filtered-projects-section'
import { asISODateString, asISOTimestampString } from '@/types/dates'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'

const PROJECTS_URL = 'http://localhost:8080/api/v1/projects'

// ─── Wrapper ─────────────────────────────────────────────────────────────────

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    return function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )
    }
}

// ─── Mock data ───────────────────────────────────────────────────────────────

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

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('FilteredProjectsSection — rendering', () => {
    it('renders the filters trigger button', async () => {
        server.use(http.get(PROJECTS_URL, () => HttpResponse.json({ message: 'OK', data: [] })))

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        expect(screen.getByText('Filtros')).toBeInTheDocument()
    })

    it('shows projects after the query resolves successfully', async () => {
        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [mockProject] })
            )
        )

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText('Cosmos Frontend')).toBeInTheDocument()
        })
    })

    it('shows the fallback message when the server returns an empty list', async () => {
        server.use(http.get(PROJECTS_URL, () => HttpResponse.json({ message: 'OK', data: [] })))

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(
                screen.getByText(/no hay proyectos con estos filtros/i)
            ).toBeInTheDocument()
        })
    })
})

// ─── Loading state ───────────────────────────────────────────────────────────

describe('FilteredProjectsSection — loading state', () => {
    it('does not render project content while the query is still pending', () => {
        server.use(http.get(PROJECTS_URL, async () => delay('infinite')))

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        expect(screen.queryByText('Cosmos Frontend')).not.toBeInTheDocument()
    })
})

// ─── Edge cases ──────────────────────────────────────────────────────────────

describe('FilteredProjectsSection — edge cases', () => {
    it('renders multiple projects correctly', async () => {
        const secondProject: ProjectsSummary = {
            ...mockProject,
            id: 2,
            name: 'Cosmos Backend',
            code: 'COB',
        }

        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [mockProject, secondProject] })
            )
        )

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText('Cosmos Frontend')).toBeInTheDocument()
            expect(screen.getByText('Cosmos Backend')).toBeInTheDocument()
        })
    })

    it('shows fallback instead of crashing when the API returns ok: false', async () => {
        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json(
                    { message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
                    { status: 401 }
                )
            )
        )

        render(<FilteredProjectsSection />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByText(/no hay proyectos con estos filtros/i)).toBeInTheDocument()
        })
    })
})
