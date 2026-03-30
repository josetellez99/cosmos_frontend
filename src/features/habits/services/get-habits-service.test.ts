import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getHabitsService } from './get-habits-service'
import type { HabitSummaryResponse } from '@/features/habits/types/response/habits'

const HABITS_URL = 'http://localhost:8080/api/v1/habits'

const mockHabit: HabitSummaryResponse = {
    id: 1,
    name: 'Morning Run',
    description: 'Run 5km in the morning',
    emoji: '🏃',
    schedule_type: 'each_x_days',
    schedule_config: '{"time": "06:00"}',
    starting_date: '2026-01-01',
    progress: 60,
}

// ─── URL construction ─────────────────────────────────────────────────────────

describe('getHabitsService — URL construction', () => {
    it('calls the habits endpoint', async () => {
        let capturedUrl = ''

        server.use(
            http.get(`${HABITS_URL}`, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getHabitsService()

        expect(capturedUrl).toBe(HABITS_URL)
    })
})

// ─── Response handling ────────────────────────────────────────────────────────

describe('getHabitsService — response handling', () => {
    it('returns ok: true with the habits array on a successful response', async () => {
        server.use(
            http.get(`${HABITS_URL}`, () => {
                return HttpResponse.json({ message: 'OK', data: [mockHabit] })
            })
        )

        const result = await getHabitsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([mockHabit])
        }
    })

    it('returns ok: true with an empty array when the server returns no habits', async () => {
        server.use(
            http.get(`${HABITS_URL}`, () => {
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        const result = await getHabitsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([])
        }
    })

    it('returns ok: false when the server responds with an HTTP error', async () => {
        server.use(
            http.get(`${HABITS_URL}`, () => {
                return HttpResponse.json(
                    { message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
                    { status: 401 }
                )
            })
        )

        const result = await getHabitsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.status).toBe(401)
            expect(result.error.code).toBe('UNAUTHORIZED')
        }
    })

    it('returns ok: false on a network failure', async () => {
        server.use(
            http.get(`${HABITS_URL}`, () => HttpResponse.error())
        )

        const result = await getHabitsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.error.code).toBe('NETWORK_ERROR')
        }
    })
})
