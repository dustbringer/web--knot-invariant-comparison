// --------------------- Interpolation ---------------------

export function lerp(start: number, end: number, value: number) {
  return start * (1 - value) + end * value;
}

// --------------------- Colors ---------------------

export function rgbLerp(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  value: number,
): [number, number, number] {
  const colorVal = (prop: number) => lerp(rgb1[prop], rgb2[prop], value);
  return [colorVal(0), colorVal(1), colorVal(2)];
}

// --------------------- Floats ---------------------

// example from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
/**
 * Adjusts a number to the specified digit.
 *
 * @param {"round" | "floor" | "ceil"} type The type of adjustment.
 * @param {number} value The number.
 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
function decimalAdjust(type: string, value: number, exp: number) {
  if (!["round", "floor", "ceil"].includes(type)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
    );
  }
  const func =
    type === "round"
      ? Math.round
      : type === "floor"
        ? Math.floor
        : type === "eil"
          ? Math.ceil
          : (x: number) => x;
  if (exp % 1 !== 0 || Number.isNaN(value)) {
    return NaN;
  } else if (exp === 0) {
    return func(value);
  }
  const [magnitude, exponent = "0"] = value.toString().split("e");
  const adjustedValue = func(Number(`${magnitude}e${Number(exponent) - exp}`));
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
  return Number(`${newMagnitude}e${Number(newExponent) + exp}`);
}

export const round10 = (value: number, exp: number) =>
  decimalAdjust("round", value, exp);
export const floor10 = (value: number, exp: number) =>
  decimalAdjust("floor", value, exp);
export const ceil10 = (value: number, exp: number) =>
  decimalAdjust("ceil", value, exp);
