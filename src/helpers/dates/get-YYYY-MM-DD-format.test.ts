import { getYYYYMMDDformat } from '@/helpers/dates/get-YYYY-MM-DD-format'

describe('getYYYYMMDDformat', () => {
    it('should return YYYY-MM-DD from an ISO datetime string', () => {
        expect(getYYYYMMDDformat('2026-03-25T12:00:00.000Z')).toBe('2026-03-25')
    })

    it('should return YYYY-MM-DD from a natural date string', () => {
        expect(getYYYYMMDDformat('March 25, 2026')).toBe('2026-03-25')
    })

    it('should return YYYY-MM-DD from a locale date string', () => {
        expect(getYYYYMMDDformat('Wed Mar 25 2026')).toBe('2026-03-25')
    })

    it('should return YYYY-MM-DD from a UTC string', () => {
        expect(getYYYYMMDDformat('Wed, 25 Mar 2026 12:00:00 GMT')).toBe('2026-03-25')
    })

    it('should return an error message for an invalid date string', () => {
        expect(getYYYYMMDDformat('not-a-date')).toBe('Ingresa una fecha válida')
    })

    it('should return an error message for a time-only string', () => {
        expect(getYYYYMMDDformat('17:17:24')).toBe('Ingresa una fecha válida')
    })

    it('should return an error message for a non-string value', () => {
        expect(getYYYYMMDDformat(12345 as any)).toBe('Ingresa una fecha válida')
    })

    it('should return an error message for an array value', () => {
        expect(getYYYYMMDDformat([2026, 3, 25] as any)).toBe('Ingresa una fecha válida')
    })

    it('should return an error message for a boolean value', () => {
        expect(getYYYYMMDDformat(false as any)).toBe('Ingresa una fecha válida')
    })

    it('should handle a leap year date correctly', () => {
        expect(getYYYYMMDDformat('2024-02-29T12:00:00.000Z')).toBe('2024-02-29')
    })
})
