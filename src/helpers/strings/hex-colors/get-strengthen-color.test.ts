import { getStrengthenColor } from "@/helpers/strings/hex-colors/get-strengthen-color"
import { isValidHexColorString } from "@/helpers/strings/hex-colors/is-valid-hex-color-string"

const ERROR_MESSAGE = "There's an error on the introduced params"

describe('getStrengthenColor', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

    it('should return a hex color string', () => {
        expect(typeof getStrengthenColor('#fafafa', 0.7)).toBe('string')
    })

    it('should return a valid hex color string', () => {
        expect(isValidHexColorString(getStrengthenColor('#bcd5e0', 0.4))).toBe(true)
    })

    // ─── Invalid hex — throws ─────────────────────────────────────────────────

    it('should throw when an empty string is passed as hexColor', () => {
        expect(() => getStrengthenColor('', 0.7)).toThrow(ERROR_MESSAGE)
    })

    it('should throw when a malformed hexColor is passed', () => {
        expect(() => getStrengthenColor('ajjansdhab', 0.7)).toThrow(ERROR_MESSAGE)
    })

    it('should throw when a hex without # prefix is passed', () => {
        expect(() => getStrengthenColor('bcd5e0', 0.7)).toThrow(ERROR_MESSAGE)
    })

    // ─── Invalid intensity — throws ───────────────────────────────────────────

    it('should throw when intensity is exactly 0', () => {
        expect(() => getStrengthenColor('#bcd5e0', 0)).toThrow(ERROR_MESSAGE)
    })

    it('should throw when intensity is negative', () => {
        expect(() => getStrengthenColor('#bcd5e0', -0.4)).toThrow(ERROR_MESSAGE)
    })
})
