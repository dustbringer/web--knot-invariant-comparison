export function effectiveExponentF(f: (n: number) => number, n: number) {
  return (
    (Math.log(f(n)) - Math.log(f(n + 1))) / (Math.log(n) - Math.log(n + 1))
  );
}

export function effectiveExponents(arr: Array<number>) {
  const ret = [];
  for (let i = 0; i < arr.length - 1; i++) {
    ret.push(
      (Math.log(arr[i]) - Math.log(arr[i + 1])) /
        (Math.log(i) - Math.log(i + 1))
    );
  }
  return ret;
}

export function successiveQuotientF(f: (n: number) => number, n: number) {
  return f(n + 1) / f(n);
}

export function successiveQuotients(arr: Array<number>) {
  const ret = [];
  for (let i = 0; i < arr.length - 1; i++) {
    ret.push(arr[i + 1] / arr[i]);
  }
  return ret;
}
