// --------------------- Array creation ---------------------
export function range(start: number, end: number) {
  return [...Array(end - start).keys()].map((i) => i + start);
}

// Fast fill with zeros
export function zeros(n: number) {
  if (n <= 0) {
    return [];
  }
  let arr: Array<number>;
  (arr = []).length = n;
  arr.fill(0);
  return arr;
}
export function zeros2(x: number, y: number) {
  if (x < 0 || y < 0) {
    return [];
  }
  let arr: Array<Array<number>>;
  (arr = []).length = x;
  for (let i = 0; i < x; i++) {
    arr[i] = zeros(y);
  }
  return arr;
}

// --------------------- Accumulation ---------------------

// Math.max dies for large arrays, we use this instead
// https://stackoverflow.com/questions/42623071/maximum-call-stack-size-exceeded-with-math-min-and-math-max
export function max(arr: Array<number>): number {
  let len = arr.length;
  let max = -Infinity;

  while (len--) {
    max = arr[len] > max ? arr[len] : max;
  }
  return max;
}

export function min(arr: Array<number>): number {
  let len = arr.length;
  let min = Infinity;

  while (len--) {
    min = arr[len] < min ? arr[len] : min;
  }
  return min;
}

export function argFilter<T>(
  f: (value: T) => boolean
): (arr: Array<T>) => Array<number> {
  return (arr: Array<T>): Array<number> => {
    return range(0, arr.length).filter((i) => f(arr[i]));
  };
}

// Returns the index in arr[index] = f(arr)
// eg. f=max, then this is argmax
export function argf<T>(
  f: (arr: Array<T>) => T
): (arr: Array<T>) => Array<number> {
  return (arr) => argFilter((value) => f(arr) === value)(arr);
  // return (arr: Array<T>): Array<number> => {
  //   const target = f(arr);
  //   return range(0, arr.length).filter((i) => arr[i] === target);
  // };
}

export function sum(list: Array<number>) {
  return list.reduce((a, b) => a + b, 0);
}

// --------------------- Counter ---------------------

// Counts elements in array and returns an object with type { [number in array]: count }
export function counter(arr: Array<number>): { [arrObj: number]: number } {
  const ret: { [arrObj: number]: number } = {};
  arr.forEach((e) => {
    ret[e] = (ret[e] ?? 0) + 1;
  });
  return ret;
}
