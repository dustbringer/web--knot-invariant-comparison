export type PolyBase = { [power: number]: number };
export type Poly = [number, PolyBase];
// the first component is the power of q to multiply to get the actual polynomial

export function polyToPolyBase(p: Poly): PolyBase {
  const res: PolyBase = {};
  Object.keys(p[1]).forEach((kStr) => {
    const k = Number(kStr);
    if (p[1][k] !== 0) res[k + p[0]] = p[1][k];
  });
  return res;
}

export function polyBaseToPoly(p: PolyBase): Poly {
  return [0, p];
}

export function polyBaseFunctor(
  f: (...p: Poly[]) => Poly
): (...p: PolyBase[]) => PolyBase {
  return (...p: PolyBase[]) => {
    return polyToPolyBase(f(...p.map(polyBaseToPoly)));
  };
}

export function polyFunctor(
  f: (...p: PolyBase[]) => PolyBase
): (...p: Poly[]) => Poly {
  return (...p: Poly[]) => {
    return polyBaseToPoly(f(...p.map(polyToPolyBase)));
  };
}

// ----------------------- stringifying PolyBase -----------------------

export function sortedStringify(poly: PolyBase) {
  const trimmedPoly: PolyBase = {};
  Object.keys(poly).map((k) => {
    const kNum = Number(k);
    if (poly[kNum] !== 0) {
      trimmedPoly[kNum] = poly[kNum];
    }
  });

  return JSON.stringify(
    trimmedPoly,
    Object.keys(trimmedPoly)
      .map(Number)
      .sort((a, b) => a - b)
      .map(String)
  );
}

// ----------------------- in Poly -----------------------

export function one(): Poly {
  return [0, { 0: 1 }];
}

export function zero(): Poly {
  return [0, { 0: 0 }];
}

export function isConst(p: Poly): boolean {
  return Object.entries(p[1]).every(([k, v]) => {
    const pwr = Number(k) + p[0];
    if (pwr !== 0) return v === 0;
    else return true;
  });
}

export function isZero(p: Poly): boolean {
  return Object.keys(p[1])
    .map(Number)
    .every((k) => p[1][k] === 0);
}

export function isOne(p: Poly): boolean {
  return (
    Object.keys(p[1])
      .map(Number)
      .every((k) => k === -p[0] || p[1][k] === 0) && p[1][-p[0]] === 1
  );
}

export function isMonomial(p: Poly): boolean {
  return Object.values(p[1]).filter((v) => v !== 0).length === 1;
}

export function polyEq(p1: Poly, p2: Poly): boolean {
  const powers = [
    ...new Set([
      ...Object.keys(p1[1]).map((k) => Number(k) + p1[0]),
      ...Object.keys(p2[1]).map((k) => Number(k) + p2[0]),
    ]),
  ];
  const isNonValue = (d: { [key: number]: number }, k: number) => {
    return !Object.keys(d).includes(String(k)) || d[k] === 0;
  };
  for (const n of powers) {
    if (
      !(isNonValue(p1[1], n - p1[0]) && isNonValue(p2[1], n - p2[0])) &&
      p1[1][n - p1[0]] !== p2[1][n - p2[0]]
    ) {
      return false;
    }
  }
  return true;
}

export function normalise(p: Poly): Poly {
  const keys = Object.keys(p[1]).map(Number);
  const min = Math.min(...keys);
  if (min === 0) {
    return p;
  }
  const r: PolyBase = {};
  keys.map((k) => {
    r[k - min] = p[1][k];
  });
  return [p[0] + min, r];
}

export function degShift(p: Poly, shift: number): Poly {
  return [p[0] + shift, p[1]];
}

export function degRescale(p: Poly, scale: number): Poly {
  const res: PolyBase = {};
  Object.keys(p[1]).forEach((kStr) => {
    const k = Number(kStr);
    res[scale * k] = p[1][k];
  });
  return [p[0] * scale, res];
}

// ----------------------- Helpers for algorithms -----------------------

// For Karasuba
function splitAt(p: Poly, pwr: number): [Poly, Poly] {
  const left: PolyBase = { 0: 0 };
  const right: PolyBase = { 0: 0 };
  for (const kStr of Object.keys(p[1])) {
    const k = Number(kStr);
    if (p[1][k] === 0) continue;
    if (k < pwr) left[k] = p[1][k];
    else right[k - pwr] = p[1][k];
  }
  return [
    [p[0], left],
    [p[0], right],
  ];
}

export function dumbMult(p1: Poly, p2: Poly): Poly {
  const r: PolyBase = { 0: 0 };
  if (isConst(p2)) {
    const tmp = p1;
    p1 = p2;
    p2 = tmp;
  }
  for (const k1Str of Object.keys(p1[1])) {
    const k1 = Number(k1Str);
    if (p1[1][k1] === 0) continue;
    else {
      for (const k2Str of Object.keys(p2[1])) {
        const k2 = Number(k2Str);
        if (p2[1][k2] === 0) continue;
        const pwr = k1 + k2;
        r[pwr] = (r[pwr] ?? 0) + p1[1][k1] * p2[1][k2];
      }
    }
  }
  return [p1[0] + p2[0], r];
}
export function dumbAdd(p1: Poly, p2: Poly): Poly {
  let base, other;
  if (p1[0] <= p2[0]) {
    base = p1;
    other = p2;
  } else {
    base = p2;
    other = p1;
  }
  const diff = other[0] - base[0];

  const r: PolyBase = { ...base[1] };
  for (const kStr of Object.keys(other[1])) {
    const k = Number(kStr);
    if (other[1][k] === 0) continue;
    else r[k + diff] = (r[k + diff] ?? 0) + other[1][k];
  }
  return [base[0], r];
}

export function dumbNeg(p: Poly): Poly {
  const r: PolyBase = {};
  Object.keys(p[1]).forEach((kStr) => {
    const k = Number(kStr);
    if (p[1][k] !== 0) r[k] = -p[1][k];
  });
  return [p[0], r];
}

// ----------------------- Efficient -----------------------

// Adapted from https://en.wikipedia.org/wiki/Karatsuba_algorithm
// For this to split properly, PolyBase's must have minimal power >= 0
export function karatsuba(p1: Poly, p2: Poly): Poly {
  // Base case
  if (isConst(p1) || isConst(p2)) return dumbMult(p1, p2);

  // Normalise both p1,p2
  p1 = normalise(p1);
  p2 = normalise(p2);

  // Split the polynomials in half
  const mx = Math.max(
    ...Object.keys(p1[1]).map(Number),
    ...Object.keys(p2[1]).map(Number)
  );
  const mSplit = Math.ceil(mx / 2);

  // Forget the extra powers for a moment
  const [p1Low, p1High] = splitAt([0, p1[1]], mSplit);
  const [p2Low, p2High] = splitAt([0, p2[1]], mSplit);

  // Recursion
  const z0 = karatsuba(p1Low, p2Low);
  const z1 = karatsuba(dumbAdd(p1Low, p1High), dumbAdd(p2Low, p2High));
  const z2 = karatsuba(p1High, p2High);

  const res = dumbAdd(
    dumbAdd(
      [2 * mSplit + z2[0], z2[1]],
      dumbAdd(
        dumbAdd([mSplit + z1[0], z1[1]], dumbNeg([mSplit + z2[0], z2[1]])),
        dumbNeg([mSplit + z0[0], z0[1]])
      )
    ),
    z0
  );
  // (z2 * x^(2*mSplit)) + ((z1 - z2 - z0) * x^mSplit) + z0

  // Put back on the powers we forgot
  return [p1[0] + p2[0] + res[0], res[1]];
}

// ----------------------- Accumulators -----------------------

export function karatsubaPow(p: Poly, n: number): Poly {
  if (n < 0) throw Error("Error in karatsubaPow: n is negative");
  if (n === 0) return [0, { 0: 1 }];
  if (n === 1) return p;
  return karatsuba(p, karatsubaPow(p, n - 1));
}

export function polyProd(...ps: Poly[]): Poly {
  if (ps.length === 0) return one();
  if (ps.length === 1) return ps[0];
  let res = ps[0];
  for (let i = 1; i < ps.length; i++) {
    res = karatsuba(res, ps[i]);
  }
  return res;
}
export function polySum(...ps: Poly[]): Poly {
  if (ps.length === 0) return zero();
  if (ps.length === 1) return ps[0];
  let res = ps[0];
  for (let i = 1; i < ps.length; i++) {
    res = dumbAdd(res, ps[i]);
  }
  return res;
}
