import { getNaturalFormatDate } from "@/helpers/dates/get-natural-format-date"

describe("getNaturalFormatDate", () => {
    it("should return the natural format with a valid string date", () => {
        const date = '2026-3-26'
        expect(getNaturalFormatDate(date)).toBe("26 de marzo de 2026")
    })

    it("should throw with an invalid date string", () => {
        const date = '2026-3-asd26'
        expect(() => getNaturalFormatDate(date)).toThrow("Ingresa una fecha válida")
    })

    it("should throw when an array is passed instead of a string", () => {
        const date = [2025, 3, 26]
        expect(() => getNaturalFormatDate(date as any)).toThrow("Ingresa una fecha válida")
    })

    it("should throw when a boolean is passed instead of a string", () => {
        const date = false
        expect(() => getNaturalFormatDate(date as any)).toThrow("Ingresa una fecha válida")
    })

    it("should return the date without the time", () => {
        const date = '2026-03-24T15:39:31.805Z'
        expect(getNaturalFormatDate(date as any)).toBe("24 de marzo de 2026")
    })
})
