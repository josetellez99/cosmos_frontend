import { getNaturalFormatDate } from "@/helpers/dates/get-natural-format-date"

describe("getNaturalFormatDate", () => {
    it("should return the natural format with a valid string date", () => {
        const date = '2026-3-26'
        expect(getNaturalFormatDate(date)).toBe("26 de marzo de 2026")
    })

    it("should return an error message with a invalid string date", () => {
        const date = '2026-3-asd26'
        expect(getNaturalFormatDate(date)).toBe("Ingresa una fecha válida")
    })

    it("should return an error message with a data type", () => {
        const date = [2025, 3, 26]
        expect(getNaturalFormatDate(date as any)).toBe("Ingresa una fecha válida")
    })

    it("should return an error message with a data type", () => {
        const date = false
        expect(getNaturalFormatDate(date as any)).toBe("Ingresa una fecha válida")
    })

    it("should return the date without the time", () => {
        const date = '2026-03-24T15:39:31.805Z'
        expect(getNaturalFormatDate(date as any)).toBe("24 de marzo de 2026")
    })
})
