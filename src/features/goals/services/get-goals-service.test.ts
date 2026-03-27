import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getUserGoalsService } from './get-goals-service'
import type { GoalSummaryResponse } from '@/features/goals/types/response/user-goals'
import { asISODateString, asISOTimestampString } from '@/types/dates'

const GOALS_URL = 'http://localhost:8080/api/v1/goals'

const mockGoal: GoalSummaryResponse = {
    id: 1,
    name: 'Learn TypeScript',
    startingDate: asISODateString('2026-01-01'),
    deadline: asISOTimestampString('2026-12-31T00:00:00.000Z'),
    color: '#3b82f6',
    sortOrder: 1,
    progress: 40,
}

// ─── URL construction ─────────────────────────────────────────────────────────
// The service's core responsibility is assembling the correct URL.
// These tests verify that — independent of what the server returns.

describe('getUserGoalsService — URL construction', () => {
    it('calls the goals endpoint with no query string when no filters are provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(`${GOALS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getUserGoalsService()

        expect(capturedUrl).toBe(GOALS_URL)
    })

    it('appends startDate and endDate as query params when provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(`${GOALS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getUserGoalsService({ startDate: '2026-01-01', endDate: '2026-12-31' })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('startDate')).toBe('2026-01-01')
        expect(url.searchParams.get('endDate')).toBe('2026-12-31')
    })

    it('appends orderBy and order when provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(`${GOALS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getUserGoalsService({ orderBy: 'sort_order', order: 'ASC' })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('orderBy')).toBe('sort_order')
        expect(url.searchParams.get('order')).toBe('ASC')
    })

    it('produces no query string when an empty object is passed', async () => {
        let capturedUrl = ''

        server.use(
            http.get(`${GOALS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getUserGoalsService({})

        // Empty object → parseObjectParamsToUrlQueryString returns "" → no "?"
        expect(capturedUrl).toBe(GOALS_URL)
        expect(capturedUrl).not.toContain('?')
    })

    it('documents the current behavior of array params (joined with comma by URLSearchParams)', async () => {
        // URLSearchParams({temporality: ['year', 'month']}) calls .toString() on the array
        // which produces "year,month" — a single value, NOT repeated params.
        // This test documents the current behavior so any change is caught explicitly.
        let capturedUrl = ''

        server.use(
            http.get(`${GOALS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getUserGoalsService({ temporality: ['year', 'month'] })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('temporality')).toBe('year,month')
    })
})

// ─── Response handling ────────────────────────────────────────────────────────
// Not re-testing HTTP error shapes (that's apiClient's job, already covered).
// Just verifying the service surfaces data and errors correctly to its caller.

describe('getUserGoalsService — response handling', () => {
    it('returns ok: true with the goals array on a successful response', async () => {
        server.use(
            http.get(`${GOALS_URL}`, () => {
                return HttpResponse.json({ message: 'OK', data: [mockGoal] })
            })
        )

        const result = await getUserGoalsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([mockGoal])
        }
    })

    it('returns ok: true with an empty array when the server returns no goals', async () => {
        server.use(
            http.get(`${GOALS_URL}`, () => {
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        const result = await getUserGoalsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([])
        }
    })

    it('returns ok: false when the server responds with an HTTP error', async () => {
        server.use(
            http.get(`${GOALS_URL}`, () => {
                return HttpResponse.json(
                    { message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
                    { status: 401 }
                )
            })
        )

        const result = await getUserGoalsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.status).toBe(401)
            expect(result.error.code).toBe('UNAUTHORIZED')
        }
    })

    it('returns ok: false on a network failure', async () => {
        server.use(
            http.get(`${GOALS_URL}`, () => HttpResponse.error())
        )

        const result = await getUserGoalsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.error.code).toBe('NETWORK_ERROR')
        }
    })
})
