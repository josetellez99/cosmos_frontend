import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SystemItem } from './system-item'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import { asISODateString, asISOTimestampString } from '@/types/dates'

// SystemItem is wrapped in a div, no routing required yet
function Wrapper({ children }: { children: React.ReactNode }) {
	return <MemoryRouter>{children}</MemoryRouter>
}

// ─── Mock systems ────────────────────────────────────────────────────────────

const base: Omit<SystemSummaryResponse, 'id' | 'name'> = {
	description: 'A comprehensive system',
	symbol: '💪',
	startingDate: asISODateString('2026-01-01'),
	createdAt: asISOTimestampString('2026-01-01T10:00:00.000Z'),
	modifiedAt: asISOTimestampString('2026-03-15T14:30:00.000Z'),
	progress: 50,
}

const fitnessSystem: SystemSummaryResponse = {
	...base,
	id: 1,
	name: 'Fitness Routine',
	progress: 65,
}

const meditationSystem: SystemSummaryResponse = {
	...base,
	id: 2,
	name: 'Meditation Practice',
	symbol: '🧘',
	progress: 45,
}

const studySystem: SystemSummaryResponse = {
	...base,
	id: 3,
	name: 'Study System',
	description: null,
	symbol: null,
	progress: 30,
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('SystemItem — rendering', () => {
	it('renders the system name', () => {
		render(<SystemItem system={fitnessSystem} />, { wrapper: Wrapper })
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})

	it('renders the system name as Typography component', () => {
		render(<SystemItem system={fitnessSystem} />, { wrapper: Wrapper })
		// The Typography component is used to render the name
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})

	it('is wrapped in a card div with proper styling classes', () => {
		const { container } = render(<SystemItem system={fitnessSystem} />, { wrapper: Wrapper })
		const card = container.querySelector('div')

		expect(card).toHaveClass('p-4')
		expect(card).toHaveClass('default-card-rounded')
		expect(card).toHaveClass('bg-white')
		expect(card).toHaveClass('border')
		expect(card).toHaveClass('border-gray-200')
	})
})

// ─── Different system types ────────────────────────────────────────────────────

describe('SystemItem — different systems', () => {
	it('renders different system names correctly', () => {
		const { rerender } = render(<SystemItem system={fitnessSystem} />, { wrapper: Wrapper })
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()

		rerender(<SystemItem system={meditationSystem} />)
		expect(screen.getByText('Meditation Practice')).toBeInTheDocument()
	})

	it('renders system with null description and symbol', () => {
		render(<SystemItem system={studySystem} />, { wrapper: Wrapper })
		expect(screen.getByText('Study System')).toBeInTheDocument()
	})

	it('renders system with various progress values', () => {
		const { rerender } = render(<SystemItem system={{ ...fitnessSystem, progress: 0 }} />, { wrapper: Wrapper })
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()

		rerender(<SystemItem system={{ ...fitnessSystem, progress: 100 }} />)
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('SystemItem — edge cases', () => {
	it('renders a system with a very long name', () => {
		const longNameSystem: SystemSummaryResponse = {
			...base,
			id: 1,
			name: 'This is a very long system name that might cause layout issues if not handled properly',
			progress: 50,
		}
		render(<SystemItem system={longNameSystem} />, { wrapper: Wrapper })
		expect(screen.getByText(/This is a very long system name/)).toBeInTheDocument()
	})

	it('renders a system with special characters in name', () => {
		const specialCharSystem: SystemSummaryResponse = {
			...base,
			id: 1,
			name: 'System & Operations (2026)',
			progress: 50,
		}
		render(<SystemItem system={specialCharSystem} />, { wrapper: Wrapper })
		expect(screen.getByText('System & Operations (2026)')).toBeInTheDocument()
	})

	it('renders a system with emoji in name', () => {
		const emojiSystem: SystemSummaryResponse = {
			...base,
			id: 1,
			name: '🚀 Product Launch System',
			progress: 75,
		}
		render(<SystemItem system={emojiSystem} />, { wrapper: Wrapper })
		expect(screen.getByText('🚀 Product Launch System')).toBeInTheDocument()
	})

	it('renders a system with zero progress', () => {
		render(<SystemItem system={{ ...fitnessSystem, progress: 0 }} />, { wrapper: Wrapper })
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})

	it('renders a system with 100% progress', () => {
		render(<SystemItem system={{ ...fitnessSystem, progress: 100 }} />, { wrapper: Wrapper })
		expect(screen.getByText('Fitness Routine')).toBeInTheDocument()
	})
})
