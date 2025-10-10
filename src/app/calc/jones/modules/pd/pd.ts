import { argf, max, range, sum } from "../../scripts/helper/array-util";
import { replaceE } from "../jones/kauffman-bracket";

export type Crossing = [number, number, number, number];
export type Knot = Array<Crossing>;

export type Edge = [number, number];
export type DirGraph = { [edgeIdx: number]: Edge };

// Warning! Doesn't know the "in" and "out" of planar embedding on loops
export function pdToDirGraph(vs: Knot): DirGraph {
  if (vs.length === 0) {
    return [];
  }
  const vsFlat = vs.flat();
  let edgeIdxs = [...new Set(vsFlat)];
  // vertex labels are exactly indices for the vertices in vs

  const next = (v: number, eInV: number): [number, number] => {
    const eIdx = vs[v][eInV];

    // other vertices that have the edge
    const candidates = vs
      .map((_, i) => i)
      .filter((i) => vs[i].includes(eIdx) && i !== v);
    if (candidates.length === 0) {
      // Loop; check where it is
      return [
        v,
        vs[v][(eInV + 1) % 4] === eIdx
          ? (eInV + 1 + 2) % 4
          : (eInV + 3 + 2) % 4,
      ];
    } else {
      const idx = vs[candidates[0]].findIndex((val) => val === eIdx);
      if (idx >= 0) {
        return [candidates[0], (idx + 2) % 4];
      } else {
        throw Error(
          "Error in pdToDirGraph>next: edge not connected to crossing"
        );
      }
    }
  };

  const edges: DirGraph = {};
  let curV = 0;
  // let curE = vs[0][0]; // used to keep track of edgeIdxs (old orientation)
  // let curEinV = 0;
  let curE = vs[0][2]; // assign index 2 edge is "out"
  let curEinV = 2;
  while (edgeIdxs.length > 0) {
    if (!edgeIdxs.includes(curE)) {
      curE = edgeIdxs[0];
      curV = vs.findIndex((x) => x.includes(curE));
      curEinV = vs[curV].findIndex((e) => e === curE);
    }

    const [nxtV, nxtEinV] = next(curV, curEinV);
    edges[curE] = [curV, nxtV]; // set value

    edgeIdxs = edgeIdxs.filter((eIdx) => eIdx !== curE);
    curV = nxtV;
    curEinV = nxtEinV;
    curE = vs[nxtV][nxtEinV];
  }

  return edges;
}

// Counts connected components of pd, output are the edges that make it up
export function connectedComponents(k: Knot): Array<Array<number>> {
  const g = pdToDirGraph(k);
  let es = Object.keys(g).map(Number);

  const components = [];

  while (es.length > 0) {
    const start = es[0];
    const edges: Array<number> = [start];
    es = es.filter((e) => e !== start);

    let curV = g[start][1];
    let curEinV = (k[curV].findIndex((e) => e === start) + 2) % 4;
    let curE = k[curV][curEinV];
    while (curE !== start) {
      edges.push(curE);
      es = es.filter((e) => e !== curE);

      const nxtV = g[curE][0] === curV ? g[curE][1] : g[curE][0];
      const nxtEinV = (k[nxtV].findIndex((e) => e === curE) + 2) % 4;

      curV = nxtV;
      curEinV = nxtEinV;
      curE = k[curV][curEinV];
    }
    components.push(edges);
  }
  return components;
}

// Gets the knot corresponding to the given components cs
export function getComponents(cs: Array<Array<number>>, k: Knot): Knot {
  const g = pdToDirGraph(k);
  const inCs: { [edge: number]: boolean } = Object.fromEntries(
    [...new Set(cs.flat())].map((e) => [e, true])
  );

  const resIdx = argf<number>((_) => 4)(
    k.map((v) => v.filter((e) => inCs[e]).length)
  ); // vertices that only have edges in this component
  const inResIdx: { [i: number]: boolean } = Object.fromEntries(
    resIdx.map((i) => [i, true])
  );

  // Removing crossings touching other components (ie. renaming edges)
  let res = resIdx.map((i) => k[i]);
  if (res.length === 0) {
    return res;
  }
  for (const c of cs) {
    let newC = [...c]; // stores renamed edges
    for (let i = 0; i < c.length; i++) {
      const v = g[c[i]][1];
      if (!inResIdx[v]) {
        // do the rename
        res = replaceE(newC[(i + 1) % newC.length], newC[i])(res);
        newC = newC.map((e) =>
          e === newC[(i + 1) % newC.length] ? newC[i] : e
        );
        // newC[i] could be different from c[i]
      }
    }
  }
  return res;
}

export function longestConnectedComponents(k: Knot): Array<Array<number>> {
  const cs = connectedComponents(k);
  // There could be more than one with the largest number of edges
  return argf(max)(cs.map((c) => c.length)).map((i) => cs[i]);
}

export const _isOut =
  (k: Knot) =>
  (v: number, i: number): boolean => {
    const g = pdToDirGraph(k);
    const x = k[v];
    if (x[i] === x[(i + 1) % 4] && x[(i + 3) % 4] === x[(i + 2) % 4]) {
      // Self contained infinity sign: (fix some orientation)
      // i in {0,2} => (in,out,out,in)
      // i in {1,3} => (in,in,out,out)
      return i === 0 || i === 1 ? false : true;
    } else if (x[i] === x[(i + 3) % 4] && x[(i + 1) % 4] === x[(i + 2) % 4]) {
      // Self contained infinity sign: (fix some orientation)
      // i in {0,2} => (in,in,out,out)
      // i in {1,3} => (in,out,out,in)
      return i === 0 || i === 3 ? false : true;
    } else if (x[i] === x[(i + 3) % 4] || x[i] === x[(i + 1) % 4]) {
      // Current one is a twist: just negate the out-ness of the opp edge
      return !(g[k[v][(i + 2) % 4]][0] === v ? true : false);
    } else {
      return g[k[v][i]][0] === v ? true : false;
    }
  };

// Correct orientation is the first is "in" and third is "out"
// other two could be anything (one "in" and one "out")
export function orient(k: Knot): Knot {
  const isOut = _isOut(k);
  return k.map((x, i) => {
    if (isOut(i, 0)) {
      return [x[2], x[3], x[0], x[1]];
    } else {
      return x;
    }
  });
}

export function writhe(k: Knot): number {
  const isOut = _isOut(k);
  const crossings = k.map((x, i) => {
    const outI = isOut(i, 0) ? 0 : 2;
    return isOut(i, outI + 1) ? -1 : 1;
  });

  // console.log(`Positive:${crossings.filter(n => n > 0).length}, Negative:${crossings.filter(n => n < 0).length}`)

  return sum(crossings);
}

export function linkingNumberComps(
  k: Knot,
  comps: Array<Array<number>>
): number {
  if (comps.length === 1) {
    return 0;
  }

  const isOut = _isOut(k);
  const links = k.map((v) => {
    const fst = comps.findIndex((comp) => comp.includes(v[0]));
    const snd = comps.findIndex((comp) => comp.includes(v[1]));
    return fst !== -1 && snd !== -1 && fst !== snd;
  });
  const crossings = k
    .map((x, i) => {
      const outI = isOut(i, 0) ? 0 : 2;
      return isOut(i, outI + 1) ? -1 : 1;
    })
    .filter((_, i) => links[i]);
  return sum(crossings) / 2;
}

// // This doesn't make sense, only have linking number of two links
// export function linkingNumber(k: Knot): number {
//   const comps = connectedComponents(k);
//   return linkingNumberComps(k, comps);
// }

export function linkingNumberBig2(k: Knot): number {
  const comps = connectedComponents(k).toSorted((a, b) => b.length - a.length);
  return linkingNumberComps(k, comps.slice(0, 2));
}

// ================= Ordering =================

// Compares if two crossings are the same
export function xEq(x1: Crossing, x2: Crossing, rot = false): boolean {
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

// An ordering on crossings, for sorting
export function xGt(x1: Crossing, x2: Crossing) {
  if (x1[0] > x2[0]) return 1;
  if (x1[0] < x2[0]) return -1;
  if (x1[1] > x2[1]) return 1;
  if (x1[1] < x2[1]) return -1;
  if (x1[2] > x2[2]) return 1;
  if (x1[2] < x2[2]) return -1;
  if (x1[3] > x2[3]) return 1;
  if (x1[3] < x2[3]) return -1;
  return -1;
}

// Sorting for comparison using JSON.stringify()
export function sortKnot(k: Knot): Knot {
  return (
    k.map((x) => (x[0] >= x[2] ? x : [...x.slice(2), ...x.slice(0, 2)])) as Knot
  ).toSorted(xGt);
}
