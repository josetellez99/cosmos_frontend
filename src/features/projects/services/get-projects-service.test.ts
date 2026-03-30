import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getprojectsService } from './get-projects-service'
import type { ProjectsSummary } from '@/features/projects/types/response/projects'
import { asISODateString, asISOTimestampString } from '@/types/dates'

const PROJECTS_URL = 'http://localhost:8080/api/v1/projects'

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

// ─── URL construction ─────────────────────────────────────────────────────────

describe('getprojectsService — URL construction', () => {
    it('calls the projects endpoint with no query string when no filters are provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(PROJECTS_URL, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getprojectsService()

        expect(capturedUrl).toBe(PROJECTS_URL)
    })

    it('appends startDate and endDate as query params when provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(PROJECTS_URL, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getprojectsService({ startDate: asISODateString('2026-01-01'), endDate: asISOTimestampString('2026-12-31T23:59:59.000Z') })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('startDate')).toBe('2026-01-01')
        expect(url.searchParams.get('endDate')).toBe('2026-12-31T23:59:59.000Z')
    })

    it('appends orderBy and order when provided', async () => {
        let capturedUrl = ''

        server.use(
            http.get(PROJECTS_URL, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getprojectsService({ orderBy: 'sort_order', order: 'ASC' })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('orderBy')).toBe('sort_order')
        expect(url.searchParams.get('order')).toBe('ASC')
    })

    it('produces no query string when an empty object is passed', async () => {
        let capturedUrl = ''

        server.use(
            http.get(PROJECTS_URL, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getprojectsService({})

        expect(capturedUrl).toBe(PROJECTS_URL)
        expect(capturedUrl).not.toContain('?')
    })

    it('serializes status array as comma-joined value (URLSearchParams behavior)', async () => {
        let capturedUrl = ''

        server.use(
            http.get(PROJECTS_URL, ({ request }) => {
                capturedUrl = request.url
                return HttpResponse.json({ message: 'OK', data: [] })
            })
        )

        await getprojectsService({ status: ['in progress', 'completed'] })

        const url = new URL(capturedUrl)
        expect(url.searchParams.get('status')).toBe('in progress,completed')
    })
})

// ─── Response handling ────────────────────────────────────────────────────────

describe('getprojectsService — response handling', () => {
    it('returns ok: true with the projects array on a successful response', async () => {
        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [mockProject] })
            )
        )

        const result = await getprojectsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([mockProject])
        }
    })

    it('returns ok: true with an empty array when the server returns no projects', async () => {
        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json({ message: 'OK', data: [] })
            )
        )

        const result = await getprojectsService()

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.data).toEqual([])
        }
    })

    it('returns ok: false when the server responds with an HTTP error', async () => {
        server.use(
            http.get(PROJECTS_URL, () =>
                HttpResponse.json(
                    { message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
                    { status: 401 }
                )
            )
        )

        const result = await getprojectsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.status).toBe(401)
            expect(result.error.code).toBe('UNAUTHORIZED')
        }
    })

    it('returns ok: false on a network failure', async () => {
        server.use(
            http.get(PROJECTS_URL, () => HttpResponse.error())
        )

        const result = await getprojectsService()

        expect(result.ok).toBe(false)
        if (!result.ok) {
            expect(result.error.code).toBe('NETWORK_ERROR')
        }
    })
})
