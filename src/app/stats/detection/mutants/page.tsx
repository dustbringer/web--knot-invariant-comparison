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
import statsAll from "./stats";
import statsA from "./stats_a";
import statsN from "./stats_n";
// import statsAllComb from "./specialised/statsComb";

import staticify from "@/util/staticURLs";
import { range } from "@/util/array-util";
import HorizontalRule from "@/components/styled/HorizontalRule";

export default function DetectionPage() {
  const [plotName, setPlotName] = React.useState<string>("unique");
  const [classChecked, setClassChecked] = React.useState<string>("all");
  const [showSQ, setShowSQ] = React.useState<boolean>(false);
  // const [showEE, setShowEE] = React.useState<boolean>(false);
  const [showTable, setShowTable] = React.useState<boolean>(true);
  const [stats, setStats] = React.useState(statsAll);

  React.useEffect(() => {
    if (classChecked === "all") {
      setStats(statsAll);
    } else if (classChecked === "a") {
      setStats((stats) => ({ ...stats, unique: statsA.unique }));
    } else if (classChecked === "n") {
      setStats((stats) => ({ ...stats, unique: statsN.unique }));
    }
  }, [classChecked]);

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
    <Container maxWidth="lg">
      <div>
        <div style={{ marginBottom: "1em" }}>
          <Typography variant="body1">
            Supplement to <em>Big data comparison of quantum invariants</em> [
            <Link href="https://arxiv.org/abs/2503.15810">arXiv</Link>;{" "}
            <Link href="https://github.com/dtubbenhauer/quantumdata">
              GitHub
            </Link>
            ].
          </Typography>
          <Typography variant="body1">
            Unique polynomials up to mutation, for knots up to 15 crossings.
          </Typography>
          {/* <Typography variant="body1">
            For the same picture ordered by hyperbolic volume, see{" "}
            <Link href="/stats/detection-volume" inPlace>
              Detection Volume
            </Link>
            . For invariant distribution histograms, see{" "}
            <Link href="/stats/dist" inPlace>
              Distribution
            </Link>
            .
          </Typography> */}
          <HorizontalRule />
          {/* <Radios
            options={Object.keys(stats).map((k) => ({ name: k, value: k }))}
            value={plotName}
            onChange={(e) => setPlotName((e.target as HTMLInputElement).value)}
          /> */}
        </div>
        {/* {plotName === "unique" && (
          <div style={{ marginBottom: "1em" }}>
            <Typography variant="body1">
              Restrict to a class of knots
            </Typography>
            <div>
              <Radios
                options={[
                  { name: "all", value: "all" },
                  { name: "alternating", value: "a" },
                  { name: "non-alternating", value: "n" },
                  // { name: "torus", value: "t" },
                  // { name: "satellite", value: "s" }, // there are some invariants that can't distinguish all of these
                  // { name: "hyperbolic", value: "h" },
                ]}
                value={classChecked}
                onChange={(e) =>
                  setClassChecked((e.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
        )} */}
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
        <Typography variant="body1" gutterBottom>
          <i>Interactive</i> plot: zoom, pan and toggle your desired invariants!
        </Typography>
        <Line
          data={(() => {
            const abbr = stats[plotName].abbreviate;
            const output = stats[plotName][
              abbr ? "columnsAbbr" : "columns" // when to abbreviate
            ].map((name, i) => ({
              x: stats[plotName].x,
              y: stats[plotName].ys?.[i] || [],
              name: name,
            }));

            return output;
          })()}
          // original: width={800} height={600}
          width={1200}
          height={900}
          layout={{
            xaxis: {
              title: stats[plotName].xlabel,
              linecolor: "black",
              linewidth: 2,
            },
            yaxis: {
              title: stats[plotName].ylabel,
              linecolor: "black",
              linewidth: 2,
              ...(stats[plotName].ylogscale && { type: "log" }),
              ...(stats[plotName].yrange !== undefined && {
                range: stats[plotName].yrange,
              }),
            },
            legend: { ...stats[plotName].legend },
          }}
          style={{ margin: "0 auto" }}
        />

        {showSQ && (
          <Line
            data={stats[plotName][
              stats[plotName].abbreviate ? "columnsAbbr" : "columns" // when to abbreviate
            ].map((name, i) => ({
              x: stats[plotName].x,
              y: successiveQuotients(stats[plotName].ys?.[i] || []),
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
        {/* {showEE && (
          <Line
            data={stats[plotName].columns.map((name, i) => ({
              x: stats[plotName].data
                .slice(0, stats[plotName].data.length - 1)
                .map((d) => d[0]),
              y: effectiveExponents(stats[plotName].data.map((d) => d[i + 1])),
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
                title: "Effective exponents",
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
        )} */}

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
                  {(
                    [
                      ["n", "n"],
                      ...range(0, stats[plotName].columns.length).map((i) => [
                        stats[plotName].columns[i],
                        stats[plotName].columnsAbbr[i],
                      ]),
                    ] as [string, string][]
                  ).map((name) => {
                    const isAbbr = stats[plotName].abbreviate;
                    return (
                      <TableCell
                        key={name[0]}
                        sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                        title={name[0]}
                      >
                        {isAbbr ? name[1] : name[0]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {stats[plotName].x.map((_, i) => (
                  <TableRow key={`row${i}`}>
                    <TableCell key={`row${i},col${-1}`}>
                      {stats[plotName].x[i]}
                    </TableCell>
                    {stats[plotName].ys.map((y, j) => (
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
