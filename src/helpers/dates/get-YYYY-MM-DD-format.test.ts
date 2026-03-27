import { getYYYYMMDDformat } from '@/helpers/dates/get-YYYY-MM-DD-format'

describe('getYYYYMMDDformat', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

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

    it('should handle a leap year date correctly', () => {
        expect(getYYYYMMDDformat('2024-02-29T12:00:00.000Z')).toBe('2024-02-29')
    })

    // ─── Invalid input — throws ───────────────────────────────────────────────

    it('should throw when an invalid date string is passed', () => {
        expect(() => getYYYYMMDDformat('not-a-date')).toThrow('Ingresa una fecha válida')
    })

    it('should throw when a time-only string is passed', () => {
        expect(() => getYYYYMMDDformat('17:17:24')).toThrow('Ingresa una fecha válida')
    })

    it('should throw when a non-string number is passed', () => {
        expect(() => getYYYYMMDDformat(12345 as any)).toThrow('You just can introduce a string')
    })

    it('should throw when an array is passed', () => {
        expect(() => getYYYYMMDDformat([2026, 3, 25] as any)).toThrow('You just can introduce a string')
    })

    it('should throw when a boolean is passed', () => {
        expect(() => getYYYYMMDDformat(false as any)).toThrow('You just can introduce a string')
    })
})
