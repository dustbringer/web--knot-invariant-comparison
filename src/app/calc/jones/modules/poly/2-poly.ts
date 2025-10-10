export type PolyBaseN = { [power: string]: number };
// power is of the form eg. "2,3,-1" for the monomial x^2 * y^3 * z^-1

export const divToMult = (term: string, vars: Array<string> = ["q", "t"]) => {
  if (!term.includes("/")) {
    return term.replace(/\(|\)/g, "");
  }
  const split = term
    .split(RegExp(`(${vars.map((s) => `${s}`).join("|")})`))
    .map((s, i) => (i % 2 === 0 ? s.split("") : s))
    .flat()
    .filter((s) => s.length > 0);

  let inQuotient = false;
  for (let i = 0; i < split.length; i++) {
    if (!inQuotient) {
      if (split[i] === "/") {
        inQuotient = true;
      }
      continue;
    }
    // Assuming only one set of brackets in quotient
    if (split[i] === "(") {
      continue;
    } else if (split[i] === ")") {
      inQuotient = false;
      continue;
    }

    if (split[i] === "^") {
      if (split[i + 1] === "+") {
        split[i + 1] = "-";
        i++;
        continue;
      } else if (split[i + 1] === "-") {
        split[i + 1] = "";
        i++;
        continue;
      } else {
        split[i] = "^-";
      }
    } else if (vars.findIndex((s) => s === split[i]) >= 0) {
      if (i + 1 < split.length && split[i + 1] === "^") {
        continue;
      } else {
        split[i] = `${split[i]}^-1`;
      }
    }
  }
  return split.join("").replace("/", "*").replace(/\(|\)/g, "");
};

// Input example: 10*q^7 + 8*q^9 + 1/(q^3*t^5) + 2/(q*t^4) + q/t^4 + (3*q)/t^3 + (2*q^3)/t^3 + (6*q^3)/t^2 + (3*q^5)/t^2 + (7*q^5)/t + (6*q^7)/t + 11*q^9*t + 9*q^11*t + 12*q^11*t^2 + 11*q^13*t^2 + 12*q^13*t^3 + 12*q^15*t^3 + 13*q^15*t^4 + 12*q^17*t^4 + 11*q^17*t^5 + 13*q^19*t^5 + 11*q^19*t^6 + 11*q^21*t^6 + 8*q^21*t^7 + 11*q^23*t^7 + 7*q^23*t^8 + 8*q^25*t^8 + 4*q^25*t^9 + 7*q^27*t^9 + 2*q^27*t^10 + 4*q^29*t^10 + q^29*t^11 + 2*q^31*t^11 + q^33*t^12
// works for wolfram polynomial output
export function parsePolyN(
  str: string,
  vars: Array<string> = ["q", "t"]
): PolyBaseN {
  // Split by the + or - between them
  const split = str
    .split(/\s+(\+|\-)\s+/)
    .map((s) => s.replace(/\s/g, ""))
    .filter((s) => s.length !== 0);

  let sign = 1;
  const output: PolyBaseN = {};
  for (let i = 0; i < split.length; i++) {
    if (split[i] === "+" || split[i] === "-") {
      sign = split[i] === "+" ? 1 : -1;
      continue;
    }

    const term = divToMult(split[i], vars);
    // console.log("\n ... \n", term);

    let coeff = sign;
    const powers = vars.map((_) => 0);
    const factors = term.split("*");
    factors.forEach((f) => {
      const vIdx = vars.findIndex(
        (v) => f === v || f.startsWith(`${v}^`) || f.startsWith(`-${v}^`)
      );
      if (vIdx < 0) {
        coeff *= Number(f);
      } else {
        // deal with starting minus (isnt detected by split(" - ")) eg. -q^(-1)
        if (f.startsWith(`-${vars[vIdx]}^`)) {
          coeff *= -1;
          f = f.slice(1);
        }

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

export function sortedStringify(poly: PolyBaseN): string {
  const trimmedPoly: PolyBaseN = {};
  Object.keys(poly).map((k) => {
    if (poly[k] !== 0) {
      trimmedPoly[k] = poly[k];
    }
  });

  return JSON.stringify(
    trimmedPoly,
    Object.keys(trimmedPoly).sort((a, b) => {
      const aa = a.split(",").map(Number);
      const bb = b.split(",").map(Number);
      for (let i = 0; i < aa.length; i++) {
        if (aa[i] !== bb[i]) {
          return aa[i] - bb[i];
        }
      }
      return 0;
    })
  );
}
