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
import HorizontalRule from "@/components/styled/HorizontalRule";

const optionsInv: { [name: string]: string } = {
  ["a2-3-16"]: "A2",
  ["alexander-3-16"]: "Alexander",
  ["b1-3-16"]: "B1",
  ["bnvdv-3-16"]: "BV",
  ["hfk2-3-16"]: "HFK2",
  ["hfk2-t1-3-16"]: "HFK2T1",
  ["homflypt-3-16"]: "HOMFLYPT",
  ["homflypt-homology-3-11"]: "HOMFLYPT Homology 3-11",
  ["homflypt-homology-partial-3-13"]: "HOMFLYPT Homology Partial 3-13",
  ["jones-3-16"]: "Jones",
  ["khovanov-3-16"]: "Khovanov",
  ["khovanov-t1-3-16"]: "KhovanovT1",
  ["khodd-3-16"]: "KhovanovOdd",
  ["kr3-3-15"]: "KR3 3-15",
};

export default function DistributionsPage() {
  const savedVals = React.useRef<{
    [val: string]: [Array<number>, Array<number>, Array<number>];
  }>({});

  const [data, setData] = React.useState<
    [Array<number>, Array<number>, Array<number>]
  >([[], [], []]);

  const [invName, setInvName] = React.useState<string>("jones-3-16");
  const [yLog, setYLog] = React.useState<boolean>(false);
  const [xLog, setXLog] = React.useState<boolean>(false);

  React.useEffect(() => {
    Promise.resolve()
      .then(() => {
        if (savedVals.current[invName] === undefined) {
          console.log(`Fetching distribution for ${invName}`);
          return Promise.all([
            fetch(staticify(`/static/dist/${invName}-dist.out`)),
            fetch(staticify(`/static/dist/${invName}-a-dist.out`)),
            fetch(staticify(`/static/dist/${invName}-n-dist.out`)),
          ])
            .then((res) => Promise.all(res.map((res) => res.text())))
            .then((ress) => {
              savedVals.current[invName] = ress.map((res) =>
                res.trim().split("\n").map(Number)
              ) as [Array<number>, Array<number>, Array<number>];
              return savedVals.current[invName];
            });
        } else {
          return Promise.resolve(savedVals.current[invName]);
        }
      })
      .then(([all, a, n]) => {
        setData([all, a, n]);
      })
      .finally(() => {
        console.log(`Fetched /static/dist/${invName}-dist.out`);
      });
  }, [invName]);

  return (
    <Container maxWidth="lg">
      <div>
        <div style={{ marginBottom: "1em" }}>
          <Typography variant="body1" gutterBottom>
            Histogram of polynomial frequencies.
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

          <HorizontalRule />

          <Typography variant="body1">Invariant</Typography>
          <Radios
            options={Object.keys(optionsInv).map((k) => ({
              name: optionsInv[k],
              value: k,
            }))}
            value={invName}
            onChange={(e) => setInvName((e.target as HTMLInputElement).value)}
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
          <div>
            <Switch
              checked={yLog}
              onChange={(e) => setYLog(e.target.checked)}
            />
            y-log
          </div>
          <div>
            <Switch
              checked={xLog}
              onChange={(e) => setXLog(e.target.checked)}
            />
            x-log
          </div>
        </div>

        <Plot
          data={data.map((d, i) => ({
            type: "histogram",
            mode: "markers",
            x: d,
            opacity: 0.4,
            name: ["all", "alternating", "non-alternating"][i],
          }))}
          config={{
            scrollZoom: true,
          }}
          layout={{
            dragmode: "pan",
            barmode: "overlay",
            xaxis: {
              type: xLog ? "log" : "linear",
              title: `${optionsInv[invName]}${xLog ? " (log scale)" : ""}`,
            },
            yaxis: {
              type: yLog ? "log" : "linear",
              title: `frequency${yLog ? " (log scale)" : ""}`,
            },
          }}
          useResizeHandler={true}
          style={{ maxWidth: `800px`, height: `600px` }}
        />
      </div>
    </Container>
  );
}
