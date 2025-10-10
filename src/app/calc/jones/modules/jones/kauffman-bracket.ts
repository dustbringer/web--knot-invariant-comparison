import { seq } from "../../scripts/helper/functions";
import {
  isZero,
  one,
  Poly,
  PolyBase,
  polyBaseToPoly,
  polyProd,
  polySum,
  polyToPolyBase,
} from "../poly/poly";
import { counter, sum } from "../../scripts/helper/array-util";

import { type Knot, type Crossing, xGt, sortKnot } from "../pd/pd";

// ***************** Functional sequencing knot manupulation *****************

// Replace edge `src` with `dst` inside Knot `k`
export const replaceE =
  (src: number, dst: number) =>
  (k: Knot): Knot =>
    k.map((x) => x.map((e) => (e === src ? dst : e)) as Crossing);

// (Function that) Connects `src` and `dst` inside Knot input
export const connect = (src: number, dst: number) =>
  replaceE(Math.max(src, dst), Math.min(src, dst));

// Compares if two crossings are the same
export function compareX(x1: Crossing, x2: Crossing, rot = false) {
  if (!rot)
    return (
      x1[0] === x2[0] && x1[1] === x2[1] && x1[2] === x2[2] && x1[3] === x2[3]
    );
  else
    return (
      (x1[0] === x2[0] &&
        x1[1] === x2[1] &&
        x1[2] === x2[2] &&
        x1[3] === x2[3]) ||
      (x1[0] === x2[2] && x1[1] === x2[3] && x1[2] === x2[0] && x1[3] === x2[1])
    );
}

// Removes crossings from Knot `k`
export const removeXs =
  (xs: Crossing[]) =>
  (k: Knot): Knot =>
    k.filter((x: Crossing) => xs.findIndex((y) => compareX(x, y)) === -1);

// ***************** Specific Helpers *****************
export function pdToGraph(vs: Array<Crossing>): Array<[number, number]> {
  const vsFlat = vs.flat();
  const count = counter(vsFlat);
  const edges = [...new Set(vsFlat)].filter((e) => count[e] === 2);
  // vertex labels are exactly indices for the vertices in vs
  return edges
    .map((e) => vs.map((_, i) => i).filter((i) => vs[i].includes(e))) // adjacent vertices
    .map((e) => (e.length === 1 ? [e[0], e[0]] : e) as [number, number]); // loops should be [v,v] not [v]
}

// Applys equation breaking a crossing down into some linear combination of non-crossing webs
export function breakdown(c: Poly, k: Knot): Array<[Poly, Knot]> {
  if (isZero(c)) {
    return [];
  }
  if (k.length === 0) return [[c, k]];

  const x = k[0];
  const xSetLen = new Set(x).size;
  k = k.slice(1);

  // Different ways a crossing can be (needed because the program can't see circles)
  if (xSetLen === 4) {
    const k1 = seq(k, [connect(x[1], x[0]), connect(x[3], x[2])]);
    const k2 = seq(k, [connect(x[2], x[1]), connect(x[3], x[0])]);
    return [
      [polyProd(c, polyBaseToPoly({ 1: 1 })), k1],
      [polyProd(c, polyBaseToPoly({ [-1]: 1 })), k2],
    ];
  } else if (xSetLen === 3) {
    // Crossing loops on itself
    const xRot =
      x[1] === x[2] || x[2] === x[3] ? [...x.slice(2), ...x.slice(0, 2)] : x; // rotate so repeated edge is at x[0]
    if (xRot[0] === xRot[1]) {
      return [
        [
          polyProd(c, polyBaseToPoly({ 3: -1 })),
          seq(k, [connect(xRot[3], xRot[2])]),
        ],
      ];
    }
    // xRot[0] === xRot[3]
    else {
      return [
        [
          polyProd(c, polyBaseToPoly({ [-3]: -1 })),
          seq(k, [connect(xRot[2], xRot[1])]),
        ],
      ];
    }
  } else {
    // len(set(x)) === 2
    // // Crossing is like an infinity symbol

    // [a,a,b,b]
    if (x[0] === x[1]) {
      return [
        [
          polyProd(
            c,
            polyBaseToPoly({ 3: -1 }),
            k.length > 0 ? polyBaseToPoly({ 2: -1, [-2]: -1 }) : one()
          ),
          k,
        ],
      ];
    }
    // x[0] === x[3] // [a,b,b,a]
    else {
      return [
        [
          polyProd(
            c,
            polyBaseToPoly({ [-3]: -1 }),
            k.length > 0 ? polyBaseToPoly({ 2: -1, [-2]: -1 }) : one()
          ),
          k,
        ],
      ];
    }
  }
}

// // A "good enough" check if two intermediate knots are the same (can have false negatives)
// // A better check will recognise more that are the same, but take longer
// export function same(k1: Knot, k2: Knot): boolean {
//   if (k1.length !== k2.length) return false;

//   // One side inclusion is enough because the sizes are the same
//   for (const x1 of k1) {
//     if (k2.findIndex((x2) => compareX(x1, x2, true)) < 0) {
//       return false;
//     }
//   }
//   return true;
// }

export function kauffmanBracket(kIn: Knot): PolyBase {
  let outputKnots = breakdown(one(), kIn); // run breakdown once
  while (sum(outputKnots.map(([_, k]) => k.length)) > 0) {
    // console.log(outputKnots.length);
    outputKnots = outputKnots.map(([c, k]) => breakdown(c, k)).flat();

    // // Group the "same knots together"
    // let outputKnotsTemp: [Poly, Knot][] = [];
    // while (outputKnots.length > 0) {
    //   const [_, k1] = outputKnots[0];

    //   const ks: { [i: number]: boolean } = {};
    //   for (let i = 0; i < outputKnots.length; i++) {
    //     if (i === 0 || same(k1, outputKnots[i][1])) {
    //       ks[i] = true;
    //     }
    //   }

    //   const collected: [Poly, Knot][] = [];
    //   const other: [Poly, Knot][] = [];
    //   for (let i = 0; i < outputKnots.length; i++) {
    //     const e = outputKnots[i];
    //     ks[i] ? collected.push(e) : other.push(e);
    //   }

    //   // outputKnots.forEach((e, i) =>
    //   //   ks[i] ? collected.push(e) : other.push(e)
    //   // );
    //   outputKnots = other;
    //   outputKnotsTemp.push([polySum(...collected.map(([c, _]) => c)), k1]);
    // }
    // outputKnots = outputKnotsTemp;

    // Using json stringify as a "same" measure
    let outputKnotsTemp: { [hash: string]: [Poly[], Knot] } = {};
    for (let i = 0; i < outputKnots.length; i++) {
      const sortedKnot = sortKnot(outputKnots[i][1]);
      const hash = JSON.stringify(sortKnot(outputKnots[i][1]));
      outputKnotsTemp[hash] ??= [[], sortedKnot];
      outputKnotsTemp[hash][0].push(outputKnots[i][0]);
    }
    outputKnots = Object.values(outputKnotsTemp).map(([ps, k]) => [
      polySum(...ps),
      k,
    ]);
  }

  return polyToPolyBase(polySum(...outputKnots.map(([c, _]) => c)));
}
