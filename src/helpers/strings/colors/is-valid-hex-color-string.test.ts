import { isValidHexColorString } from "@/helpers/strings/colors/is-valid-hex-color-string";

describe('isValidHexColorString', () => {

    it('Should return the false when pass a string greater than 7', () => {
        expect(isValidHexColorString('12345678')).toBe(false);
    })

    it('Should return the false when pass a string smaller than 2', () => {
        expect(isValidHexColorString('1')).toBe(false);
    })

    it('Should return the false when pass a string with no #', () => {
        expect(isValidHexColorString('fafafa')).toBe(false);
    })

    it('Should return the false when pass a string with no # in the first position', () => {
        expect(isValidHexColorString('fa#fafa')).toBe(false);
    })

    it('Should return the false when pass a string with no #', () => {
        expect(isValidHexColorString('#zafafa')).toBe(false);
    })

    it('Should return the true when a valid hex color is passed', () => {
        expect(isValidHexColorString('#3b3b3b')).toBe(true);
    })

    it('Should return the true when a valid hex color is passed', () => {
        expect(isValidHexColorString('#bcd5e0')).toBe(true);
    })
})