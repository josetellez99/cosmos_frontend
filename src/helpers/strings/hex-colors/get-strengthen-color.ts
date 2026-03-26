import { isValidHexColorString } from "@/helpers/strings/hex-colors/is-valid-hex-color-string";

/**
 * Generates a stronger color variant from a soft/light base color
 * @param hexColor - Hex color code (e.g., "#FFE5CC")
 * @param intensity - Intensity factor from 0 to 1 (0 = original, 1 = maximum darkness)
 * @returns Stronger version of the color with adjusted saturation and lightness
 */
export const getStrengthenColor = (hexColor: string, intensity: number): string => {

    if(!isValidHexColorString(hexColor)) return 'Introduce a valid hexColor param';
    if(intensity <= 0) return 'Introduce a valid intensity param'

    // Parse hex to RGB
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
  
    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
  
    // Convert HSL back to RGB
    const hslToRgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
  
    // Apply intensity factor to saturation and lightness
    const saturationBoost = Math.min(s + intensity * 0.35, 1);
    const lightnessReduction = Math.max(l - intensity * 0.7, 0);

    const q = lightnessReduction < 0.5 ? lightnessReduction * (1 + saturationBoost) : lightnessReduction + saturationBoost - lightnessReduction * saturationBoost;
    const p = 2 * lightnessReduction - q;

    const newR = Math.round(hslToRgb(p, q, h + 1 / 3) * 255);
    const newG = Math.round(hslToRgb(p, q, h) * 255);
    const newB = Math.round(hslToRgb(p, q, h - 1 / 3) * 255);

    const toHex = (num: number): string => {
      const hex = num.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }