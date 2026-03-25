import { strengthenColor } from "@/helpers/strings/hex-colors/get-strengthen-color"

describe('strengthenColor', () => {
    it('should return a string', () => {
        expect(typeof strengthenColor('#fafafa', 0.7)).toBe('string')
    })

    it('should return a mesagge when an empty string is passed as hexColor', () => {
        expect(strengthenColor('', 0.7)).toBe('Introduce a valid hexColor param')
    })

    it('should return a mesagge when a malformed hexColor param is passed', () => {
        expect(strengthenColor('ajjansdhab', 0.7)).toBe('Introduce a valid hexColor param')
    })


    // intensity as cero '0'
    // Validate we are passing a valid color hex string
    // The output is type string
    // The output has a specific format
})