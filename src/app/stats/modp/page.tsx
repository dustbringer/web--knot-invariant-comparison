"use client";

import * as React from "react";

import { styled } from "@mui/material";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Container from "@/components/Container";
import { DivFlexCenterHJ } from "@/components/styled/Divs";
import Radio from "@/components/Radios";
import Histogram from "@/components/Plots/Histogram";
import Line from "@/components/Plots/Line";
import Link from "@/components/Link";
import { statsJones, statsKhovanov } from "./stats";

import staticify from "@/util/staticURLs";
import HorizontalRule from "@/components/styled/HorizontalRule";

type StatsType = {
  [name: string]: {
    ylabel: string;
    xlabel: string;
    ylogscale?: boolean;
    yrange?: [number, number];
    legend: {
      yanchor: "top" | "bottom";
      y: number;
      xanchor: "left" | "right";
      x: number;
    };
    columns: Array<string>;
    x: Array<number>;
    ys: Array<Array<number>>;
  };
};
const nameToStat: { [name: string]: StatsType } = {
  jones: statsJones,
  khovanov: statsKhovanov,
};

export default function ModPPage() {
  const [plotName, setPlotName] = React.useState<string>("count");
  const [invName, setInvName] = React.useState<string>("jones");
  const [invStats, setInvStats] = React.useState<StatsType>(statsJones);
  const [showTable, setShowTable] = React.useState<boolean>(true);
  const [showSQ, setShowSQ] = React.useState<boolean>(false);

  React.useEffect(() => {
    setInvStats(nameToStat[invName] ?? statsJones);
    setPlotName("count");
  }, [invName]);

  const successiveQuotients = (arr: Array<number>) => {
    const ret = [];
    for (let i = 0; i < arr.length - 1; i++) {
      ret.push(arr[i + 1] / arr[i]);
    }
    return ret;
  };

  // const effectiveExponents = (arr: Array<number>) => {
  //   const ret = [];
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     ret.push(
  //       (Math.log(arr[i]) - Math.log(arr[i + 1])) /
  //         (Math.log(i) - Math.log(i + 1))
  //     );
  //   }
  //   return ret;
  // };

  return (
    <Container maxWidth="md">
      <div>
        <div style={{ marginBottom: "1em" }}>
          {/* <Typography variant="body1">
            Supplement to <em>On detection probabilities of link invariants</em>{" "}
            [<Link href="https://arxiv.org/abs/2509.05574">arXiv</Link>;{" "}
            <Link href="https://github.com/dtubbenhauer/knotdetection">
              GitHub
            </Link>
            ].
          </Typography> */}
          <Typography variant="body1">
            Data for Jones polynomials, with coefficients reduced mod p, that
            are trivial.
          </Typography>
          <HorizontalRule />
          <div>
            <Radio
              title="Invariant"
              options={[
                { name: "Jones", value: "jones" },
                { name: "Khovanov", value: "khovanov" },
              ]}
              value={invName}
              onChange={(e) => setInvName((e.target as HTMLInputElement).value)}
            />
          </div>
          <div>
            <Radio
              title="Plot"
              options={Object.keys(invStats).map((k) => ({
                name: k,
                value: k,
              }))}
              value={plotName}
              onChange={(e) =>
                setPlotName((e.target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
        <div style={{ marginBottom: "1em" }}>
          <Typography variant="body1">
            Toggle successive quotients plot and data table.
          </Typography>
          <div>
            <Switch
              checked={showSQ}
              onChange={(e) => setShowSQ(e.target.checked)}
            />
            Successive quotients
          </div>
          <div>
            <Switch
              checked={showTable}
              onChange={(e) => setShowTable(e.target.checked)}
            />
            Table
          </div>
        </div>
        {/* <div>
          <Switch
            checked={showEE}
            onChange={(e) => setShowEE(e.target.checked)}
          />
          Effective exponents
        </div> */}
      </div>

      <div>
        <Typography variant="body1">
          <i>Interactive</i> plot: zoom, pan and toggle your desired options!
        </Typography>
        <Line
          data={invStats[plotName].columns.map((name, i) => ({
            x: invStats[plotName].x,
            y: invStats[plotName].ys?.[i] || [],
            name: name,
          }))}
          width={800}
          height={600}
          layout={{
            xaxis: {
              title: invStats[plotName].xlabel,
              linecolor: "black",
              linewidth: 2,
            },
            yaxis: {
              title: invStats[plotName].ylabel,
              linecolor: "black",
              linewidth: 2,
              ...(invStats[plotName].ylogscale && { type: "log" }),
              ...(invStats[plotName].yrange !== undefined && {
                range: invStats[plotName].yrange,
              }),
            },
            legend: { ...invStats[plotName].legend },
          }}
          style={{ margin: "0 auto" }}
        />

        {showSQ && (
          <Line
            data={invStats[plotName]["columns"].map((name, i) => ({
              x: invStats[plotName].x,
              y: successiveQuotients(invStats[plotName].ys?.[i] || []),
              name: name,
            }))}
            width={800}
            height={600}
            layout={{
              xaxis: {
                title: "Number of crossings",
                linecolor: "black",
                linewidth: 2,
              },
              yaxis: {
                title: "Succesive quotients",
                linecolor: "black",
                linewidth: 2,
                // type: "log",
              },
              legend: {
                yanchor: "top",
                y: 0.99,
                xanchor: "left",
                x: 0.01,
              },
            }}
            style={{ margin: "0 auto" }}
          />
        )}

        {showTable && (
          <TableContainer
            sx={{
              margin: "1em 0",
              border: "1px solid lightgrey",
              borderRadius: "5px",
            }}
          >
            <Table
              sx={{
                minWidth: 650,
              }}
              size="small"
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {["n", ...invStats[plotName].columns].map((name) => (
                    <TableCell
                      key={name}
                      sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                    >
                      {name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {invStats[plotName].x.map((_, i) => (
                  <TableRow
                    key={`row${i}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:nth-of-type(odd)": {
                        backgroundColor: "white",
                      },
                      "&:nth-of-type(even)": {
                        backgroundColor: "#f7f7f7",
                      },
                    }} // last element has no bottom border
                  >
                    <TableCell key={`row${i},col${-1}`}>
                      {invStats[plotName].x[i]}
                    </TableCell>
                    {invStats[plotName].ys.map((y, j) => (
                      <TableCell key={`row${i},col${j}`}>
                        {isNaN(y[i]) ? "-" : y[i]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Container>
  );
}
