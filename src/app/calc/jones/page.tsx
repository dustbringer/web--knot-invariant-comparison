"use client";

import * as React from "react";

import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import Container from "@/components/Container";
import Radio from "@/components/Radios";
import Link from "@/components/Link";

import staticify from "@/util/staticURLs";

// Jones calulator
import { jones } from "./modules/jones/jones";
import { PolyBase } from "./modules/poly/poly";
// Input validator
import Ajv, { JSONType } from "ajv";
import { Knot } from "./modules/pd/pd";
const validateInput = new Ajv().compile({
  type: "array",
  items: {
    type: "array",
    items: { type: "number" },
    maxItems: 4,
    minItems: 4,
  },
});

const polyToString = (p: PolyBase): string => {
  const terms = Object.entries(p)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([k, v], i) => {
      const sign = v >= 0 ? (i > 0 ? "+" : "") : "-";
      const coeff = Math.abs(v) === 1 ? (k === "0" ? "1" : "") : Math.abs(v);
      const monomial = k === "0" ? "" : k === "1" ? "q" : `q^{${k}}`;
      return `${sign}${coeff}${monomial}`;
    });
  return terms.join("");
};

export default function JonesCalcPage() {
  const [input, setInput] = React.useState<string>("[]");
  const [poly, setPoly] = React.useState<PolyBase>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const parseInput = () => {
    const data = JSON.parse(input);
    if (
      validateInput(data) &&
      [...new Set((data as Knot).flat())].every(
        (n) => (data as Knot).flat().filter((m) => m === n).length === 2
      )
    ) {
      setLoading(true);
      const p = jones(JSON.parse(input));
      setPoly(p);
      setLoading(false);
    } else {
      console.error(
        "Error in input:",
        validateInput.errors ||
          "Every number in the knot PD must appear exactly twice"
      );
    }
  };

  return (
    <Container maxWidth="md">
      <div>
        <div style={{ marginBottom: "1em" }}>
          <Typography variant="body1">
            Jones polynomial calculator (from PD)
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="body1">
          <strong>Input:</strong> A knot in planar diagram form. E.g.{" "}
          <Typography component="span" sx={{ fontFamily: "Roboto Mono" }}>
            [[1,5,2,4],[3,1,4,6],[5,3,6,2]]
          </Typography>{" "}
          for the trefoil.
        </Typography>
        <Typography variant="body1">
          <strong>Warning!</strong> For large knots (eg. {">"}50 crossings) this
          may cause your browser to hang and use lots of memory.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
          }}
        >
          <TextField
            label="Input"
            rows={10}
            multiline
            margin="dense"
            size="small"
            fullWidth
            autoFocus
            variant="outlined"
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: "Roboto Mono",
                },
              },
            }}
            sx={{ marginTop: "8px", marginBottom: "8px" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="contained"
            disableRipple
            sx={{ margin: "8px", marginRight: 0 }}
            onClick={parseInput}
            title="Run"
          >
            Run
          </Button>
        </Box>

        <Typography variant="body1" gutterBottom>
          <TeX>{polyToString(poly)}</TeX>
        </Typography>

        <Typography
          variant="body2"
          sx={{ fontFamily: "Roboto Mono", overflowWrap: "break-word" }}
        >
          {JSON.stringify(poly)}
        </Typography>
      </div>
    </Container>
  );
}
