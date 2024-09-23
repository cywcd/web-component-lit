/* eslint-disable prefer-const */
// Shorthands
const {min, max, floor, round} = Math;

/**
 * Tries to convert a color name to rgb/a hex representation
 * @param name
 * @returns {string | CanvasGradient | CanvasPattern}
 */
function standardizeColor(name: string): string {
  // Since invalid color's will be parsed as black, filter them out
  if (name.toLowerCase() === 'black') {
    return '#000000';
  }

  const ctx = document
    .createElement('canvas')
    .getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = name;
  return ctx.fillStyle === '#000000' ? '' : ctx.fillStyle;
}

/**
 * Convert HSV spectrum to RGB.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} Array with rgb values.
 */
export function hsvToRgb(h: number, s: number, v: number): number[] {
  h = (h / 360) * 6;
  s /= 100;
  v /= 100;

  const i = floor(h);

  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return [r * 255, g * 255, b * 255];
}

/**
 * Convert HSV spectrum to Hex.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {string[]} Hex values
 */
export function hsvToHex(h: number, s: number, v: number): string[] {
  return hsvToRgb(h, s, v).map((v) => round(v).toString(16).padStart(2, '0'));
}

/**
 * Convert HSV spectrum to CMYK.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} CMYK values
 */
export function hsvToCmyk(h: number, s: number, v: number): number[] {
  const rgb = hsvToRgb(h, s, v);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  let k, c, m, y;

  k = min(1 - r, 1 - g, 1 - b);

  c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return [c * 100, m * 100, y * 100, k * 100];
}

/**
 * Convert HSV spectrum to HSL.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} HSL values
 */
export function hsvToHsl(h: number, s: number, v: number): number[] {
  (s /= 100), (v /= 100);

  const l = ((2 - s) * v) / 2;

  if (l !== 0) {
    if (l === 1) {
      s = 0;
    } else if (l < 0.5) {
      s = (s * v) / (l * 2);
    } else {
      s = (s * v) / (2 - l * 2);
    }
  }
  return [h, s * 100, l * 100];
}

/**
 * Convert RGB to HSV.
 * @param r Red
 * @param g Green
 * @param b Blue
 * @return {number[]} HSV values.
 */
export function rgbToHsv(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);

  let h = 0,
    s = 0,
    v = 0;
  const minVal = min(r, g, b);
  const maxVal = max(r, g, b);
  const delta = maxVal - minVal;

  v = maxVal;
  if (delta === 0) {
    h = s = 0;
  } else {
    s = delta / maxVal;
    const dr = ((maxVal - r) / 6 + delta / 2) / delta;
    const dg = ((maxVal - g) / 6 + delta / 2) / delta;
    const db = ((maxVal - b) / 6 + delta / 2) / delta;

    if (r === maxVal) {
      h = db - dg;
    } else if (g === maxVal) {
      h = 1 / 3 + dr - db;
    } else if (b === maxVal) {
      h = 2 / 3 + dg - dr;
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  return [h * 360, s * 100, v * 100];
}

/**
 * Convert CMYK to HSV.
 * @param c Cyan
 * @param m Magenta
 * @param y Yellow
 * @param k Key (Black)
 * @return {number[]} HSV values.
 */
export function cmykToHsv(c: number, m: number, y: number, k: number) {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  const r = (1 - min(1, c * (1 - k) + k)) * 255;
  const g = (1 - min(1, m * (1 - k) + k)) * 255;
  const b = (1 - min(1, y * (1 - k) + k)) * 255;

  return [...rgbToHsv(r, g, b)];
}

/**
 * Convert HSL to HSV.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @return {number[]} HSV values.
 */
export function hslToHsv(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  s *= l < 0.5 ? l : 1 - l;
  const ns = l + s ? ((2 * s) / (l + s)) * 100 : 0;
  const v = (l + s) * 100;
  return [h, ns, v];
}

/**
 * Convert HEX to HSV.
 * @param hex Hexadecimal string of RGB colors, can have length 3 or 6.
 * @returns HSV values as an array of numbers [H, S, V].
 */
export function hexToHsv(hex: string): number[] {
  // Remove any '#' prefix from the hex string
  hex = hex.replace(/^#/, '');

  // Validate hex string length
  if (hex.length !== 3 && hex.length !== 6) {
    throw new Error('Invalid hex length, must be 3 or 6 characters');
  }

  // Parse hex string into RGB components
  const match = hex.match(/.{2}/g);
  if (!match) {
    throw new Error('Invalid hex format');
  }
  const [r, g, b] = match.map((component) => parseInt(component, 16));

  // Convert RGB to HSV
  return rgbToHsv(r, g, b);
}

/**
 * Try's to parse a string which represents a color to a HSV array.
 * Current supported types are cmyk, rgba, hsla and hexadecimal.
 * @param str
 * @return {*}
 */
interface ColorValues {
  values: number[] | null;
  type: string | null;
  a?: number | undefined;
  b?: number | undefined;
}

export function parseToHSVA(str: string): ColorValues {
  // Check if string is a color-name
  str = str.match(/^[a-zA-Z]+$/) ? standardizeColor(str) : str;

  interface RegexMap {
    [key: string]: RegExp;
  }

  const regex: RegexMap = {
    cmyk: /^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,
    rgba: /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hsla: /^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hsva: /^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i,
  };

  const numarize = (array: string[]): (number | undefined)[] =>
    array.map((v) => (/^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : undefined));

  let match: RegExpExecArray | null;

  for (const type in regex) {
    if ((match = regex[type].exec(str)) !== null) {
      switch (type) {
        case 'cmyk': {
          const [, c, m, y, k] = numarize(match.slice(1));
          if (
            c &&
            m &&
            y &&
            k &&
            c <= 100 &&
            m <= 100 &&
            y <= 100 &&
            k <= 100
          ) {
            return {values: cmykToHsv(c, m, y, k), type};
          }
          break;
        }
        case 'rgba': {
          const [, , , r, g, b, a] = numarize(match.slice(1));
          if (
            r !== undefined &&
            g !== undefined &&
            b !== undefined &&
            a !== undefined &&
            r <= 255 &&
            g <= 255 &&
            b <= 255 &&
            a >= 0 &&
            a <= 1
          ) {
            return {values: [...rgbToHsv(r, g, b), a], type, a};
          }
          break;
        }
        case 'hexa': {
          let [, hex] = match;
          if (hex.length === 4 || hex.length === 3) {
            hex = hex
              .split('')
              .map((v) => v + v)
              .join('');
          }
          const raw = hex.substring(0, 6);
          const a = hex.substring(6);
          const b = a ? parseInt(a, 16) / 255 : undefined;
          const hsv = hexToHsv(raw) as number[];
          return {values: [...hsv, b as number], type, b};
        }
        case 'hsla': {
          const [, , , h, s, l, a] = numarize(match.slice(1));
          if (
            h !== undefined &&
            s !== undefined &&
            l !== undefined &&
            a !== undefined &&
            h <= 360 &&
            s <= 100 &&
            l <= 100 &&
            a >= 0 &&
            a <= 1
          ) {
            return {values: [...hslToHsv(h, s, l), a], type, a};
          }
          break;
        }
        case 'hsva': {
          const [, , , h, s, v, a] = numarize(match.slice(1));
          if (
            h !== undefined &&
            s !== undefined &&
            v !== undefined &&
            a !== undefined &&
            h <= 360 &&
            s <= 100 &&
            v <= 100 &&
            a >= 0 &&
            a <= 1
          ) {
            return {values: [h, s, v, a], type, a};
          }
          break;
        }
      }
    }
  }

  return {values: null, type: null};
}
