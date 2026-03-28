import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectsList } from './projects-list'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'
import { asISODateString, asISOTimestampString } from '@/types/dates'

// ─── Mock data ───────────────────────────────────────────────────────────────

const base = {
    startingDate: asISODateString('2026-01-01'),
    deadline: asISOTimestampString('2026-06-30T00:00:00.000Z'),
    status: 'in progress' as const,
    sortOrder: 1,
}

const projectA: ProjectsSummary = {
    ...base,
    id: 1,
    name: 'Cosmos Frontend',
    code: 'COS',
    progress: 45,
}

const projectB: ProjectsSummary = {
    ...base,
    id: 2,
    name: 'Cosmos Backend',
    code: 'COB',
    progress: 80,
}

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('ProjectsList — rendering', () => {
    it('renders the fallback message when the list is empty', () => {
        render(<ProjectsList projects={[]} fallbackMessage="No hay proyectos" />)

        expect(screen.getByText('No hay proyectos')).toBeInTheDocument()
    })

    it('does not render list items when the list is empty', () => {
        render(<ProjectsList projects={[]} fallbackMessage="No hay proyectos" />)

        expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })

    it('renders project names when projects are provided', () => {
        render(<ProjectsList projects={[projectA, projectB]} fallbackMessage="No hay proyectos" />)

        expect(screen.getByText('Cosmos Frontend')).toBeInTheDocument()
        expect(screen.getByText('Cosmos Backend')).toBeInTheDocument()
    })

    it('renders the correct number of list items', () => {
        render(<ProjectsList projects={[projectA, projectB]} fallbackMessage="No hay proyectos" />)

        expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('does not render the fallback message when projects exist', () => {
        render(<ProjectsList projects={[projectA]} fallbackMessage="No hay proyectos" />)

        expect(screen.queryByText('No hay proyectos')).not.toBeInTheDocument()
    })
})

// ─── Edge cases ──────────────────────────────────────────────────────────────

describe('ProjectsList — edge cases', () => {
    it('renders a single project correctly', () => {
        render(<ProjectsList projects={[projectA]} fallbackMessage="No hay proyectos" />)

        expect(screen.getAllByRole('listitem')).toHaveLength(1)
        expect(screen.getByText('Cosmos Frontend')).toBeInTheDocument()
    })

    it('renders the project code inside brackets', () => {
        render(<ProjectsList projects={[projectA]} fallbackMessage="No hay proyectos" />)

        expect(screen.getByText('[COS]')).toBeInTheDocument()
    })

    it('renders the progress percentage', () => {
        render(<ProjectsList projects={[projectA]} fallbackMessage="No hay proyectos" />)

        expect(screen.getByText('45%')).toBeInTheDocument()
    })
})
