import { range, sum } from "../../scripts/helper/array-util";
import {
  degRescale,
  PolyBase,
  polyBaseToPoly,
  polyProd,
  polyToPolyBase,
} from "../poly/poly";
import { kauffmanBracket, removeXs } from "./kauffman-bracket";
import { type Knot, type Crossing } from "../pd/pd";

import { writhe } from "../pd/pd";

export function jones(k: Knot): PolyBase {
  // "circle" has no crossings
  if (k === undefined) {
    return {};
  }
  if (k.length === 0) {
    return { 0: 1 };
  }

  const w = writhe(k);
  const pre = polyProd(
    polyBaseToPoly({ [3 * -w]: Math.abs(w) % 2 === 0 ? 1 : -1 }),
    polyBaseToPoly(kauffmanBracket(k))
  );
  return polyToPolyBase(degRescale(pre, -1 / 4));
}
