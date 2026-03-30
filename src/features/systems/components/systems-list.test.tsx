import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SystemsList } from './systems-list'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import { asISODateString, asISOTimestampString } from '@/types/dates'

function Wrapper({ children }: { children: React.ReactNode }) {
	return <MemoryRouter>{children}</MemoryRouter>
}

// ─── Mock systems ────────────────────────────────────────────────────────────

const mockSystem: SystemSummaryResponse = {
	id: 1,
	name: 'Fitness Routine',
	description: 'Daily exercise tracking',
	symbol: '💪',
	startingDate: asISODateString('2026-01-01'),
	createdAt: asISOTimestampString('2026-01-01T10:00:00.000Z'),
	modifiedAt: asISOTimestampString('2026-03-15T14:30:00.000Z'),
	progress: 65,
}

const system2: SystemSummaryResponse = {
	...mockSystem,
	id: 2,
	name: 'Meditation Practice',
	symbol: '🧘',
	progress: 45,
}

const system3: SystemSummaryResponse = {
	...mockSystem,
	id: 3,
	name: 'Study System',
	progress: 30,
}

// ─── Rendering with systems ───────────────────────────────────────────────────

describe('SystemsList — rendering with systems', () => {
	it('renders a single system', () => {
		render(
			<SystemsList systems={[mockSystem]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})

	it('renders multiple systems', () => {
		render(
			<SystemsList systems={[mockSystem, system2, system3]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
		expect(screen.getByText('Meditation Practice')).toBeInTheDocument()
		expect(screen.getByText('Study System')).toBeInTheDocument()
	})

	it('renders systems in the order provided', () => {
		render(
			<SystemsList systems={[mockSystem, system2, system3]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		const items = screen.getAllByRole('listitem')
		expect(items).toHaveLength(3)
		expect(items[0].textContent).toContain('Fitness Routine')
		expect(items[1].textContent).toContain('Meditation Practice')
		expect(items[2].textContent).toContain('Study System')
	})

	it('renders systems in a ul element', () => {
		const { container } = render(
			<SystemsList systems={[mockSystem, system2]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		const ul = container.querySelector('ul')
		expect(ul).toBeInTheDocument()
		expect(ul).toHaveClass('flex')
		expect(ul).toHaveClass('flex-col')
		expect(ul).toHaveClass('spacing-in-list-elements')
	})

	it('wraps each system in a li element', () => {
		const { container } = render(
			<SystemsList systems={[mockSystem, system2]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		const lis = container.querySelectorAll('li')
		expect(lis).toHaveLength(2)
	})
})

// ─── Rendering fallback message ────────────────────────────────────────────────

describe('SystemsList — fallback message', () => {
	it('renders the fallback message when systems array is empty', () => {
		render(
			<SystemsList systems={[]} fallbackMessage="No tienes sistemas creados todavía." />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('No tienes sistemas creados todavía.')).toBeInTheDocument()
	})

	it('does NOT render systems when array is empty', () => {
		render(
			<SystemsList systems={[]} fallbackMessage="No systems found" />,
			{ wrapper: Wrapper }
		)

		expect(screen.queryByText('Fitness Routine')).not.toBeInTheDocument()
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
	})

	it('shows custom fallback message text', () => {
		const customMessage = 'Crea tu primer sistema para comenzar'

		render(
			<SystemsList systems={[]} fallbackMessage={customMessage} />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText(customMessage)).toBeInTheDocument()
	})

	it('renders only fallback, not both fallback and systems', () => {
		render(
			<SystemsList systems={[]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('No systems')).toBeInTheDocument()
		expect(screen.queryByRole('list')).not.toBeInTheDocument()
	})
})

// ─── Priority of rendering ────────────────────────────────────────────────────

describe('SystemsList — rendering priority', () => {
	it('prioritizes fallback message over systems list when systems is empty', () => {
		render(
			<SystemsList systems={[]} fallbackMessage="Empty state message" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('Empty state message')).toBeInTheDocument()
		expect(screen.queryByRole('list')).not.toBeInTheDocument()
	})

	it('ignores fallback message when systems are provided', () => {
		render(
			<SystemsList
				systems={[mockSystem]}
				fallbackMessage="This should not appear"
			/>,
			{ wrapper: Wrapper }
		)

		expect(screen.queryByText('This should not appear')).not.toBeInTheDocument()
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})
})

// ─── Edge cases ────────────────────────────────────────────────────────────────

describe('SystemsList — edge cases', () => {
	it('renders a large number of systems', () => {
		const largeSystems = Array.from({ length: 100 }, (_, i) => ({
			...mockSystem,
			id: i + 1,
			name: `System ${i + 1}`,
		}))

		render(
			<SystemsList systems={largeSystems} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText('System 1')).toBeInTheDocument()
		expect(screen.getByText('System 100')).toBeInTheDocument()
		expect(screen.getAllByRole('listitem')).toHaveLength(100)
	})

	it('handles systems with identical names', () => {
		const duplicateNameSystems = [
			mockSystem,
			{ ...system2, name: 'Fitness Routine', id: 2 },
		]

		render(
			<SystemsList systems={duplicateNameSystems} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		const items = screen.getAllByText('Fitness Routine')
		expect(items).toHaveLength(2)
	})

	it('handles systems with very long names', () => {
		const longNameSystem: SystemSummaryResponse = {
			...mockSystem,
			name: 'This is an extremely long system name that goes on and on and might break the layout if not properly handled with CSS',
		}

		render(
			<SystemsList systems={[longNameSystem]} fallbackMessage="No systems" />,
			{ wrapper: Wrapper }
		)

		expect(screen.getByText(/This is an extremely long system name/)).toBeInTheDocument()
	})
})
