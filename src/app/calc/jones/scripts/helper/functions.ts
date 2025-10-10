// Sequentially runs a list of functions `fs` on an input `x`
export const seq = <T>(x: T, fs: Array<(x: T) => T>) => {
  fs.forEach((f) => (x = f(x)));
  return x;
};
