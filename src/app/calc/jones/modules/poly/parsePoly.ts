import { type PolyBaseN } from "./2-poly";

// output of https://www.maths.dur.ac.uk/users/dirk.schuetz/knotjob.html
export function parsePolyN_knotjob(
  str: string,
  vars: Array<string> = ["q", "t"]
): PolyBaseN {
  // Split by the + or - between them
  const split = str
    .split(/\s+(\+|\-)\s+/)
    // .map((s) => s.replace(/\s/g, "")) // NO! multiplication is delimited by a space
    .filter((s) => s.length !== 0);

  let sign = 1;
  const output: PolyBaseN = {};
  for (let i = 0; i < split.length; i++) {
    if (split[i] === "+" || split[i] === "-") {
      sign = split[i] === "+" ? 1 : -1;
      continue;
    }

    const term = split[i];

    let coeff = sign;
    const powers = vars.map((_) => 0);
    const factors = term.split(" ");
    factors.forEach((f) => {
      const vIdx = vars.findIndex((v) => f === v || f.startsWith(`${v}^`));
      if (vIdx < 0) {
        coeff *= Number(f);
      } else {
        powers[vIdx] += Number(
          f === vars[vIdx] ? 1 : f.slice(vars[vIdx].length + 1)
        );
      }
    });
    const key = powers.map((n) => `${n}`).join(",");
    output[key] = output[key] ?? 0 + coeff;
  }

  return output;
}

// output of https://web.math.princeton.edu/~szabo/HFKcalc.html
// only for one of the knots
export function parsePolyN_hfk(
  str: string
  // vars: Array<string> = ["q", "t"]
): PolyBaseN {
  const terms = str
    .split("Ranks in Alexander, Maslov bigradings :")[1] // before
    .split("Total rank :")[0] // after
    .trim()
    .split("\n");

  const output: PolyBaseN = {};
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i].replace(/\s/g, "").split("(");
    term[1] = term[1].slice(0, term[1].length - 1); // remove the last bracket
    output[term[1]] = Number(term[0]);
  }

  return output;
}

// output of ???
export function parsePolyN_homfly_homology(
  str: string,
  vars: Array<string> = ["q", "t", "a"]
): PolyBaseN {
  // Split by the + or - between them
  const split = str
    .split(/\s+(\+|\-)\s+/)
    // .map((s) => s.replace(/\s/g, "")) // NO! multiplication is delimited by a space
    .filter((s) => s.length !== 0);

  let sign = 1;
  const output: PolyBaseN = {};
  for (let i = 0; i < split.length; i++) {
    if (split[i] === "+" || split[i] === "-") {
      sign = split[i] === "+" ? 1 : -1;
      continue;
    }

    const term = split[i];

    let coeff = sign;
    const powers = vars.map((_) => 0);
    const details = term
      .split(new RegExp(`([${vars.join("")})])`))
      .map((s) => s.replace(/[\^{}]/g, ""));
    // eg. "2qa^2".split(/([tqa])/) = [ "2", "q", "", "a", "^2" ]
    // eg. "t^{-1}a^2".split(/([tqa])/) = [ "", "t", "^{-1}", "a", "^2" ]

    if (details[0] !== "") {
      coeff *= Number(details[0]);
    }
    for (let i = 1; i < details.length; i++) {
      let f = details[i];
      const vIdx = vars.findIndex((v) => f === v);
      f = details[++i]; // read the power
      powers[vIdx] += Number(f === "" ? 1 : f);
    }

    const key = powers.map((n) => `${n}`).join(",");
    output[key] = output[key] ?? 0 + coeff;
  }

  return output;
}
