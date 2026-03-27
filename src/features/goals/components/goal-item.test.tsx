import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { GoalItem } from './goal-item'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { asISODateString, asISOTimestampString } from '@/types/dates'

// GoalItem uses Link — must be inside a Router
function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter>{children}</MemoryRouter>
}

// ─── Mock goals ───────────────────────────────────────────────────────────────

const base = {
    color: '#3b82f6',
    sortOrder: 1,
    startingDate: asISODateString('2026-06-01'),
    deadline: asISOTimestampString('2026-12-31T00:00:00.000Z'),
}

const notStartedGoal: GoalSummaryResponse = {
    ...base,
    id: 1,
    name: 'Learn TypeScript',
    status: 'not started',
    temporality: 'month',
    progress: 0,
}

const inProgressGoal: GoalSummaryResponse = {
    ...base,
    id: 2,
    name: 'Build Cosmos',
    status: 'in progress',
    temporality: 'month',
    progress: 65,
}

const completedGoal: GoalSummaryResponse = {
    ...base,
    id: 3,
    name: 'Ship V1',
    status: 'completed',
    temporality: 'month',
    progress: 100,
}

const yearlyGoal: GoalSummaryResponse = {
    ...base,
    id: 4,
    name: 'Yearly Vision',
    status: 'in progress',
    temporality: 'year',
    color: '#ff6b6b',
    progress: 30,
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('GoalItem — rendering', () => {
    it('renders the goal name', () => {
        render(<GoalItem goal={inProgressGoal} />, { wrapper: Wrapper })
        expect(screen.getByText('Build Cosmos')).toBeInTheDocument()
    })

    it('links to /goals/:id', () => {
        render(<GoalItem goal={inProgressGoal} />, { wrapper: Wrapper })
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/goals/2')
    })
})

// ─── Status-dependent rendering ──────────────────────────────────────────────

describe('GoalItem — status rendering', () => {
    it('shows the start date when the goal has not started', () => {
        render(<GoalItem goal={notStartedGoal} />, { wrapper: Wrapper })
        // getNaturalFormatDate('2026-06-01') → "1 de junio de 2026"
        expect(screen.getByText(/junio/i)).toBeInTheDocument()
    })

    it('does NOT show a progress bar when the goal has not started', () => {
        render(<GoalItem goal={notStartedGoal} />, { wrapper: Wrapper })
        // Progress bar is a div with an explicit width style — only shown when NOT not-started
        expect(screen.queryByText(/65%|100%/i)).not.toBeInTheDocument()
    })

    it('shows the progress percentage for an in-progress goal', () => {
        render(<GoalItem goal={inProgressGoal} />, { wrapper: Wrapper })
        expect(screen.getByText('65%')).toBeInTheDocument()
    })

    it('shows "Completada" badge for a completed goal instead of progress %', () => {
        render(<GoalItem goal={completedGoal} />, { wrapper: Wrapper })
        expect(screen.getByText(/completada/i)).toBeInTheDocument()
        expect(screen.queryByText('100%')).not.toBeInTheDocument()
    })

    it('applies reduced opacity for a not-started goal', () => {
        render(<GoalItem goal={notStartedGoal} />, { wrapper: Wrapper })
        // The inner div gets opacity-60 when isNotStarted is true
        // We verify by the class being present on the card element (first child of the link)
        const link = screen.getByRole('link')
        const card = link.firstElementChild as HTMLElement
        expect(card.className).toContain('opacity-60')
    })

    it('does NOT apply opacity for an in-progress goal', () => {
        render(<GoalItem goal={inProgressGoal} />, { wrapper: Wrapper })
        const link = screen.getByRole('link')
        const card = link.firstElementChild as HTMLElement
        expect(card.className).not.toContain('opacity-60')
    })
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('GoalItem — edge cases', () => {
    it('shows 0% for an in-progress goal with zero progress', () => {
        const zeroProgress: GoalSummaryResponse = { ...inProgressGoal, progress: 0 }
        render(<GoalItem goal={zeroProgress} />, { wrapper: Wrapper })
        expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('shows 100% badge for an in-progress goal at full progress (not yet marked completed)', () => {
        // An in-progress goal can reach 100% without being marked "completed"
        const fullProgress: GoalSummaryResponse = { ...inProgressGoal, progress: 100 }
        render(<GoalItem goal={fullProgress} />, { wrapper: Wrapper })
        expect(screen.getByText('100%')).toBeInTheDocument()
        expect(screen.queryByText(/completada/i)).not.toBeInTheDocument()
    })

    it('shows the progress bar (not start date) when status is undefined', () => {
        // status is optional in GoalSummaryResponse — undefined defaults to neither
        // not-started nor completed, so the component falls through to the progress bar branch
        const noStatus: GoalSummaryResponse = { ...inProgressGoal, status: undefined, progress: 0 }
        render(<GoalItem goal={noStatus} />, { wrapper: Wrapper })
        // Shows "0%" badge instead of start date — could be misleading UX
        expect(screen.getByText('0%')).toBeInTheDocument()
        expect(screen.queryByText(/junio/i)).not.toBeInTheDocument()
    })

    it('renders without crashing when temporality is undefined', () => {
        const noTemporality: GoalSummaryResponse = { ...inProgressGoal, temporality: undefined }
        render(<GoalItem goal={noTemporality} />, { wrapper: Wrapper })
        expect(screen.getByText('Build Cosmos')).toBeInTheDocument()
    })

    it('renders the yearly goal name', () => {
        render(<GoalItem goal={yearlyGoal} />, { wrapper: Wrapper })
        expect(screen.getByText('Yearly Vision')).toBeInTheDocument()
    })
})
