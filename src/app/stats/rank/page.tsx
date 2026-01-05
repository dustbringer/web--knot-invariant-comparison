"use client";

import * as React from "react";

import { Box, Button, styled } from "@mui/material";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@/components/Table/TR";
import Paper from "@mui/material/Paper";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Container from "@/components/Container";
import { DivFlexCenterHJ } from "@/components/styled/Divs";
import Radios from "@/components/Radios";
import Checkboxes from "@/components/Checkboxes";
import Histogram from "@/components/Plots/Histogram";
import Line from "@/components/Plots/Line";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";

import staticify from "@/util/staticURLs";
import { range } from "@/util/array-util";

const optionsVal: { [name: string]: string } = {
  ["hypvol"]: "hypvol",
  ["det"]: "det",
  ["det-primedivisors"]: "det-primedivisors",
  ["sig"]: "sig",
  // ["sig-mod4"]: "sig-mod4",
  ["3genus-avg"]: "3genus",
  // ["arf"]: "Arf",
  ["s-inv"]: "s-inv",
  // ["s-inv-abs"]: "s-inv-abs",
};

const optionsInv: { [name: string]: string } = {
  ["a2-3-16"]: "A2",
  ["alexander-3-16"]: "Alexander",
  ["b1-3-16"]: "B1",
  ["bnvdv-3-16"]: "BV",
  ["hfk2-3-16"]: "HFK2",
  // ["hfk2-t1-3-16"]: "HFK2T1",
  ["homflypt-3-16"]: "HOMFLYPT",
  ["jones-3-16"]: "Jones",
  ["khovanov-3-16"]: "Khovanov",
  // ["khovanov-t1-3-16"]: "KhovanovT1",
  ["khodd-3-16"]: "KhovanovOdd",
  ["kr3-3-15"]: "KR3 3-15",
};

export default function RankPage() {
  const savedVals = React.useRef<{
    [val: string]: { [inv: string]: Array<[number, number, number]> };
  }>({});

  const [invName, setInvName] = React.useState<string>("jones-3-16");
  const [xName, setXName] = React.useState<string>("hypvol");
  const [yLog, setYLog] = React.useState<boolean>(true);

  const [dataXY, setDataXY] = React.useState<
    Array<{ name?: string; x: Array<number>; y: Array<number> }>
  >([]);

  React.useEffect(() => {
    Promise.resolve()
      .then(() => {
        if (
          savedVals.current[xName] === undefined ||
          savedVals.current[xName][invName] === undefined
        ) {
          console.log(`Fetching rank-${xName} for ${invName}`);
          return fetch(
            staticify(`/static/rank/rank-${xName}-${invName}.sample.txt`)
          )
            .then((res) => res.text())
            .then((res) => {
              savedVals.current[xName] ??= {};
              savedVals.current[xName][invName] = res
                .trim()
                .split("\n")
                .map(
                  (lines) =>
                    lines.split(",").map(Number) as [number, number, number]
                );
              return savedVals.current[xName][invName];
            });
        } else {
          return Promise.resolve(savedVals.current[xName][invName]);
        }
      })
      .then((res) => {
        const cnBuckets: { [cn: number]: Array<[number, number]> } = {};
        res.forEach((line) => {
          const cn = line[2];
          cnBuckets[cn] ??= [];
          cnBuckets[cn].push([line[0], line[1]]);
        });
        console.log(Object.keys(cnBuckets));
        console.log(cnBuckets[3]);
        setDataXY(
          Object.keys(cnBuckets).map((_cn: string) => ({
            name: _cn,
            x: cnBuckets[Number(_cn)].map((line) => line[1]),
            y: cnBuckets[Number(_cn)].map((line) => line[0]),
          }))
        );
      })
      .finally(() => {
        console.log(`Fetched /static/rank/rank-${xName}-${invName}.sample.txt`);
      });
  }, [xName, invName]);

  return (
    <Container maxWidth="lg">
      <div>
        <div style={{ marginBottom: "1em" }}>
          <Typography variant="body1" gutterBottom>
            Polynomial invariant rank correlated with numerical invariants.
          </Typography>
          {/* <Typography variant="body1">
            Supplement to <em>Big data comparison of quantum invariants</em> [
            <Link href="https://arxiv.org/abs/2503.15810">arXiv</Link>;{" "}
            <Link href="https://github.com/dtubbenhauer/quantumdata">
              GitHub
            </Link>
            ].
          </Typography> */}
          {/* <Typography variant="body1">
            For statistics of the polynomials, see{" "}
            <Link href="/stats" inPlace>
              Stats
            </Link>
            . For the same picture ordered by hyperbolic volume, see{" "}
            <Link href="/stats/detection-volume" inPlace>
              Detection Volume
            </Link>
            .
          </Typography> */}
          <Typography variant="body1">Invariant</Typography>
          <Radios
            options={Object.keys(optionsInv).map((k) => ({
              name: optionsInv[k],
              value: k,
            }))}
            value={invName}
            onChange={(e) => setInvName((e.target as HTMLInputElement).value)}
          />

          <Typography variant="body1">x-axis</Typography>
          <Radios
            options={Object.keys(optionsVal).map((k) => ({
              name: optionsVal[k],
              value: k,
            }))}
            value={xName}
            onChange={(e) => setXName((e.target as HTMLInputElement).value)}
          />
          {/* <Typography variant="body1">
            (Note: We have high confidence in the data up to 16 crossings.
            Beyond that point, confidence drops due to the large volume of data
            (eg. unforeseen errors in the data or calculation).)
          </Typography> */}
        </div>
      </div>

      <div>
        <Typography variant="body1" gutterBottom>
          <i>Interactive</i> plot: zoom, pan and toggle your desired invariants!
        </Typography>
        <div>
          <Switch checked={yLog} onChange={(e) => setYLog(e.target.checked)} />
          y-log
        </div>
        <Line
          data={dataXY.map((d, i) => ({
            x: d.x,
            // y: arr.map((n) => Math.abs(n) + 0.01),
            y: yLog ? d.y.map((n) => n + 0.000001) : d.y,
            name: d.name,
            mode: "markers",
          }))}
          width={800}
          height={600}
          layout={{
            xaxis: {
              linecolor: "black",
              title: `${optionsVal[xName]}`,
            },
            yaxis: {
              linecolor: "black",
              type: yLog ? "log" : "linear",
              title: `rank${yLog ? " (log scale)" : ""}`,
            },
            legend: {
              yanchor: "top",
              y: 0.99,
              xanchor: "left",
              x: 1.01,
            },
          }}
          style={{ margin: "0 auto" }}
        />
      </div>
    </Container>
  );
}
