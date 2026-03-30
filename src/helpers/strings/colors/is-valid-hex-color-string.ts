export const isValidHexColorString = (hexColor: string) => {
    if(hexColor.length > 7 || hexColor.length < 2) return false
    return /^#[0-9a-f]+$/i.test(hexColor)
}