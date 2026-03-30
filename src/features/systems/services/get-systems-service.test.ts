import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getSystemsService } from './get-systems-service'
import type { SystemSummaryResponse } from '@/features/systems/types/response/system-summary'
import { asISODateString, asISOTimestampString } from '@/types/dates'

const SYSTEMS_URL = 'http://localhost:8080/api/v1/systems'

const mockSystem: SystemSummaryResponse = {
	id: 1,
	name: 'Fitness Routine',
	description: 'Daily exercise and health tracking',
	symbol: '💪',
	startingDate: asISODateString('2026-01-01'),
	createdAt: asISOTimestampString('2026-01-01T10:00:00.000Z'),
	modifiedAt: asISOTimestampString('2026-03-15T14:30:00.000Z'),
	progress: 65,
}

// ─── URL construction ─────────────────────────────────────────────────────────
// The service's core responsibility is assembling the correct URL.
// These tests verify that — independent of what the server returns.

describe('getSystemsService — URL construction', () => {
	it('calls the systems endpoint with no query string when no filters are provided', async () => {
		let capturedUrl = ''

		server.use(
			http.get(`${SYSTEMS_URL}`, ({ request }) => {
				capturedUrl = request.url
				return HttpResponse.json({ message: 'OK', data: [] })
			})
		)

		await getSystemsService()

		expect(capturedUrl).toBe(SYSTEMS_URL)
	})

	it('produces no query string when an empty object is passed', async () => {
		let capturedUrl = ''

		server.use(
			http.get(`${SYSTEMS_URL}`, ({ request }) => {
				capturedUrl = request.url
				return HttpResponse.json({ message: 'OK', data: [] })
			})
		)

		await getSystemsService({})

		// Empty object → parseObjectParamsToUrlQueryString returns "" → no "?"
		expect(capturedUrl).toBe(SYSTEMS_URL)
		expect(capturedUrl).not.toContain('?')
	})

	it('handles the current API endpoint structure correctly', async () => {
		let capturedUrl = ''

		server.use(
			http.get(`${SYSTEMS_URL}`, ({ request }) => {
				capturedUrl = request.url
				return HttpResponse.json({ message: 'OK', data: [] })
			})
		)

		await getSystemsService()

		// Verify the endpoint is exactly as expected (no trailing slashes, correct path)
		expect(capturedUrl).toMatch(/^http:\/\/localhost:8080\/api\/v1\/systems$/)
	})
})

// ─── Response handling ────────────────────────────────────────────────────────
// Not re-testing HTTP error shapes (that's apiClient's job, already covered).
// Just verifying the service surfaces data and errors correctly to its caller.

describe('getSystemsService — response handling', () => {
	it('returns ok: true with the systems array on a successful response', async () => {
		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json({ message: 'OK', data: [mockSystem] })
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.data).toEqual([mockSystem])
		}
	})

	it('returns ok: true with an empty array when the server returns no systems', async () => {
		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json({ message: 'OK', data: [] })
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.data).toEqual([])
		}
	})

	it('returns ok: true with multiple systems', async () => {
		const system2: SystemSummaryResponse = {
			...mockSystem,
			id: 2,
			name: 'Meditation Practice',
			symbol: '🧘',
			progress: 45,
		}

		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json({ message: 'OK', data: [mockSystem, system2] })
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.data).toHaveLength(2)
			expect(result.data[0].name).toBe('Fitness Routine')
			expect(result.data[1].name).toBe('Meditation Practice')
		}
	})

	it('handles nullable fields correctly (description, symbol, createdAt, modifiedAt)', async () => {
		const systemWithoutOptionalFields: SystemSummaryResponse = {
			id: 1,
			name: 'Minimal System',
			description: null,
			symbol: null,
			startingDate: asISODateString('2026-01-01'),
			createdAt: null,
			modifiedAt: null,
			progress: 0,
		}

		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json({ message: 'OK', data: [systemWithoutOptionalFields] })
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.data[0].description).toBeNull()
			expect(result.data[0].symbol).toBeNull()
			expect(result.data[0].createdAt).toBeNull()
			expect(result.data[0].modifiedAt).toBeNull()
		}
	})

	it('returns ok: false when the server responds with an HTTP error', async () => {
		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json(
					{ message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: {} } },
					{ status: 401 }
				)
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(false)
		if (!result.ok) {
			expect(result.status).toBe(401)
			expect(result.error.code).toBe('UNAUTHORIZED')
		}
	})

	it('returns ok: false on a network failure', async () => {
		server.use(
			http.get(`${SYSTEMS_URL}`, () => HttpResponse.error())
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(false)
		if (!result.ok) {
			expect(result.error.code).toBe('NETWORK_ERROR')
		}
	})

	it('returns ok: false when the server responds with a 500 error', async () => {
		server.use(
			http.get(`${SYSTEMS_URL}`, () => {
				return HttpResponse.json(
					{ message: 'Internal Server Error', error: { code: 'INTERNAL_SERVER_ERROR', details: {} } },
					{ status: 500 }
				)
			})
		)

		const result = await getSystemsService()

		expect(result.ok).toBe(false)
		if (!result.ok) {
			expect(result.status).toBe(500)
		}
	})
})
