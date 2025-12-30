// --------------------- Interpolation ---------------------

export function lerp(start: number, end: number, value: number) {
  return start * (1 - value) + end * value;
}

// --------------------- Colors ---------------------

export function rgbLerp(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  value: number
): [number, number, number] {
  const colorVal = (prop: number) => lerp(rgb1[prop], rgb2[prop], value);
  return [colorVal(0), colorVal(1), colorVal(2)];
}
