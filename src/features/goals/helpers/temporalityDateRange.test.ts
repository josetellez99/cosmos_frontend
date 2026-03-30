import { afterEach, describe, expect, it, vi } from 'vitest'
import { getTemporalityDateRange } from '@/features/goals/helpers/temporalityDateRange'

// Helper: mock "now" to a specific local date at noon (avoids midnight UTC-edge issues)
const mockDate = (year: number, month: number, day: number) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(year, month, day, 12, 0, 0))
}

afterEach(() => {
    vi.useRealTimers()
})

// ─── year ────────────────────────────────────────────────────────────────────

describe('year', () => {
    it('spans Jan 1 to Dec 31 of the current year', () => {
        mockDate(2026, 2, 15) // Mar 15 2026
        expect(getTemporalityDateRange('year')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-12-31',
        })
    })
})

// ─── semester ────────────────────────────────────────────────────────────────

describe('semester', () => {
    it('returns H1 when in June (last month of first semester)', () => {
        mockDate(2026, 5, 30) // Jun 30 — month index 5, still < 6
        expect(getTemporalityDateRange('semester')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-06-30',
        })
    })

    it('returns H2 when in July (first month of second semester)', () => {
        mockDate(2026, 6, 1) // Jul 1 — month index 6, >= 6
        expect(getTemporalityDateRange('semester')).toEqual({
            startDate: '2026-07-01',
            endDate: '2026-12-31',
        })
    })

    it('returns H1 in January', () => {
        mockDate(2026, 0, 1)
        expect(getTemporalityDateRange('semester')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-06-30',
        })
    })

    it('returns H2 in December', () => {
        mockDate(2026, 11, 31)
        expect(getTemporalityDateRange('semester')).toEqual({
            startDate: '2026-07-01',
            endDate: '2026-12-31',
        })
    })
})

// ─── quarter ─────────────────────────────────────────────────────────────────

describe('quarter', () => {
    it('returns Q1 in January', () => {
        mockDate(2026, 0, 1)
        expect(getTemporalityDateRange('quarter')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-03-31',
        })
    })

    it('returns Q1 in March (last month of Q1)', () => {
        mockDate(2026, 2, 31)
        expect(getTemporalityDateRange('quarter')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-03-31',
        })
    })

    it('returns Q2 in April (first month of Q2)', () => {
        mockDate(2026, 3, 1)
        expect(getTemporalityDateRange('quarter')).toEqual({
            startDate: '2026-04-01',
            endDate: '2026-06-30',
        })
    })

    it('returns Q3 in September (last month of Q3)', () => {
        mockDate(2026, 8, 30)
        expect(getTemporalityDateRange('quarter')).toEqual({
            startDate: '2026-07-01',
            endDate: '2026-09-30',
        })
    })

    it('returns Q4 in October (first month of Q4)', () => {
        mockDate(2026, 9, 1)
        expect(getTemporalityDateRange('quarter')).toEqual({
            startDate: '2026-10-01',
            endDate: '2026-12-31',
        })
    })
})

// ─── month ───────────────────────────────────────────────────────────────────

describe('month', () => {
    it('returns Feb 1–28 in a non-leap year', () => {
        mockDate(2025, 1, 15) // Feb 2025 — not a leap year
        expect(getTemporalityDateRange('month')).toEqual({
            startDate: '2025-02-01',
            endDate: '2025-02-28',
        })
    })

    it('returns Feb 1–29 in a leap year', () => {
        mockDate(2024, 1, 15) // Feb 2024 — leap year
        expect(getTemporalityDateRange('month')).toEqual({
            startDate: '2024-02-01',
            endDate: '2024-02-29',
        })
    })

    it('returns Dec 1–31 (month+1 overflow resolves correctly)', () => {
        mockDate(2026, 11, 15) // December — month index 11, month+1=12
        expect(getTemporalityDateRange('month')).toEqual({
            startDate: '2026-12-01',
            endDate: '2026-12-31',
        })
    })

    it('returns Jan 1–31', () => {
        mockDate(2026, 0, 15)
        expect(getTemporalityDateRange('month')).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-01-31',
        })
    })
})

// ─── week ────────────────────────────────────────────────────────────────────

describe('week', () => {
    // Mar 1 2026 is a Sunday (dayOfWeek = 0)
    it('returns a week starting on the same day when today is Sunday', () => {
        mockDate(2026, 2, 1) // Sunday
        expect(getTemporalityDateRange('week')).toEqual({
            startDate: '2026-03-01',
            endDate: '2026-03-07',
        })
    })

    // Mar 7 2026 is a Saturday (dayOfWeek = 6)
    it('returns a week ending on the same day when today is Saturday', () => {
        mockDate(2026, 2, 7) // Saturday
        expect(getTemporalityDateRange('week')).toEqual({
            startDate: '2026-03-01',
            endDate: '2026-03-07',
        })
    })

    // Apr 1 2026 is a Wednesday (dayOfWeek = 3) — week crosses month boundary
    it('returns correct range when the week spans a month boundary', () => {
        mockDate(2026, 3, 1) // Wednesday Apr 1
        expect(getTemporalityDateRange('week')).toEqual({
            startDate: '2026-03-29',
            endDate: '2026-04-04',
        })
    })

    // Dec 31 2025 is a Wednesday (dayOfWeek = 3) — week crosses year boundary
    it('returns correct range when the week spans a year boundary', () => {
        mockDate(2025, 11, 31) // Wednesday Dec 31 2025
        expect(getTemporalityDateRange('week')).toEqual({
            startDate: '2025-12-28',
            endDate: '2026-01-03',
        })
    })
})

// ─── day ─────────────────────────────────────────────────────────────────────

describe('day', () => {
    it('returns startDate equal to endDate', () => {
        mockDate(2026, 2, 25)
        const result = getTemporalityDateRange('day')
        expect(result.startDate).toBe(result.endDate)
        expect(result.startDate).toBe('2026-03-25')
    })
})

// ─── long_term ───────────────────────────────────────────────────────────────

describe('long_term', () => {
    it('returns the same range as year', () => {
        mockDate(2026, 2, 15)
        expect(getTemporalityDateRange('long_term')).toEqual(
            getTemporalityDateRange('year')
        )
    })
})

// ─── unknown value (default branch) ──────────────────────────────────────────

describe('unknown temporality', () => {
    it('falls through to the default and returns the full year range', () => {
        mockDate(2026, 2, 15)
        expect(getTemporalityDateRange('unknown_value' as any)).toEqual({
            startDate: '2026-01-01',
            endDate: '2026-12-31',
        })
    })
})

// ─── invariant: startDate <= endDate for all temporalities ───────────────────

describe('startDate is always <= endDate', () => {
    const temporalities = ['year', 'semester', 'quarter', 'month', 'week', 'day', 'long_term'] as const
    const dates = [
        new Date(2026, 0, 1),   // Jan 1 — Q1 start, H1, Sunday
        new Date(2026, 2, 31),  // Mar 31 — Q1 end
        new Date(2026, 5, 30),  // Jun 30 — H1 end
        new Date(2026, 6, 1),   // Jul 1 — H2 start
        new Date(2025, 11, 31), // Dec 31 — year boundary
        new Date(2024, 1, 29),  // Feb 29 — leap day
    ]

    for (const date of dates) {
        for (const temporality of temporalities) {
            it(`${temporality} on ${date.toDateString()}`, () => {
                vi.useFakeTimers()
                vi.setSystemTime(date)
                const { startDate, endDate } = getTemporalityDateRange(temporality)
                expect(startDate <= endDate).toBe(true)
            })
        }
    }
})
