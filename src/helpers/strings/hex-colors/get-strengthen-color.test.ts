import { getStrengthenColor } from "@/helpers/strings/hex-colors/get-strengthen-color"

describe('strengthenColor', () => {

    const errorMessageHexColor = 'Introduce a valid hexColor param';
    const errorMessageIntensity = 'Introduce a valid intensity param';

    it('should return a string', () => {
        expect(typeof getStrengthenColor('#fafafa', 0.7)).toBe('string')
    })

    it('should return a mesagge when an empty string is passed as hexColor', () => {
        expect(getStrengthenColor('', 0.7)).toBe(errorMessageHexColor)
    })

    it('should return a mesagge when a malformed hexColor param is passed', () => {
        expect(getStrengthenColor('ajjansdhab', 0.7)).toBe(errorMessageHexColor)
    })

    it('should return a mesagge when a < 0 intensity param is passed', () => {
        expect(getStrengthenColor('#bcd5e0', 0)).toBe(errorMessageIntensity)
    })

    it('should return a mesagge when a < 0 intensity param is passed', () => {
        expect(getStrengthenColor('#bcd5e0', 0.4)).toBe(errorMessageIntensity)
    })

    it('should return a mesagge when a < 0 intensity param is passed', () => {
        expect(getStrengthenColor('#bcd5e0', -0.4)).toBe(errorMessageIntensity)
    })
})