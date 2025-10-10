import fs from "fs";

import {
  readLines as readLinesBasic,
  writeLines,
} from "../../scripts/helper/basic-readwrite";
import type { Knot } from "./pd";

export function namesToPD(names: Array<string>) {
  const dict: { [name: string]: Knot } = JSON.parse(
    readLinesBasic("modules/pd/knot-table-primebase-PD.json").join("")
  );
  return names.map((name) => dict[name]);
}
