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
import Radio from "@/components/Radio";
import Histogram from "@/components/Plots/Histogram";
import Line from "@/components/Plots/Line";
import Link from "@/components/Link";
import stats from "./stats";

import staticify from "@/util/staticURLs";

export default function StatsPage() {
  const [plotName, setPlotName] = React.useState<string>("unique");
  const [showSQ, setShowSQ] = React.useState<boolean>(false);
  // const [showEE, setShowEE] = React.useState<boolean>(false);
  const [showTable, setShowTable] = React.useState<boolean>(true);

  // const [dataPairs, setDataPairs] = React.useState<
  //   Array<{ x: Array<number>; name?: string }>
  // >([]);
  // const [dataUnique, setDataUnique] = React.useState<
  //   Array<{ x: Array<number>; y: Array<number>; name?: string }>
  // >([]);

  // React.useEffect(() => {
  //   Promise.all([
  //     fetch(`random-pairs-a2-3-16-vect.out`),
  //     fetch(`random-pairs-alexander-3-16-vect.out`),
  //     // fetch(`random-pairs-b1-3-15-vect.out`),
  //     fetch(`random-pairs-jones-3-16-vect.out`),
  //     fetch(`random-pairs-khovanov-3-16-vect.out`),
  //     fetch(`random-pairs-khovanov-t1-3-16-vect.out`),
  //   ])
  //     .then((res) => Promise.all(res.map((r) => r.text())))
  //     .then((res) => {
  //       const names = ["A2", "Alexander", "Jones", "Khovanov", "KhovanovT1"];
  //       console.log("Started Pairs processing");
  //       setDataPairs(
  //         res.map((text, i) => ({
  //           x: text.split("\n").map(Number),
  //           name: names[i],
  //         }))
  //       );
  //       console.log("Finished Pairs processing");
  //     });
  // }, []);

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
          <Typography variant="body1">
            Select interactive plots shown in the paper.
          </Typography>
          <Radio
            options={Object.keys(stats).map((k) => ({ name: k, value: k }))}
            value={plotName}
            onChange={(e) => setPlotName((e.target as HTMLInputElement).value)}
          />
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
          <i>Interactive</i> plot: zoom, pan and toggle your desired invariants!
        </Typography>
        <Line
          data={stats[plotName].columns.map((name, i) => ({
            x: stats[plotName].data.map((d) => d[0]),
            y: stats[plotName].data.map((d) => d[i + 1]),
            name: name,
          }))}
          width={800}
          height={600}
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
            data={stats[plotName].columns.map((name, i) => ({
              x: stats[plotName].data
                .slice(0, stats[plotName].data.length - 1)
                .map((d) => d[0]),
              y: successiveQuotients(stats[plotName].data.map((d) => d[i + 1])),
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
                  {["n", ...stats[plotName].columns].map((name) => (
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
                {stats[plotName].data.map((row, i) => (
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
                    {row.map((n, j) => (
                      <TableCell key={`row${i},col${j}`}>
                        {isNaN(n) ? "-" : n}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* A Box plot */}
      <Typography variant="body1">
        See also the{" "}
        <Link href="/stats/boxplot" inPlace>
          computation time boxplot
        </Link>
        .
      </Typography>
    </Container>
  );
}
