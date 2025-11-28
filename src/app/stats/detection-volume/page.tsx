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
// import statsA from "./stats_a";
// import statsN from "./stats_n";
// import statsAllComb from "./statsComb";

import staticify from "@/util/staticURLs";
import { range } from "@/util/array-util";
import Grid from "@/components/Plots/Grid";

export default function DetectionVolumePage() {
  const [plotName, setPlotName] = React.useState<string>("unique");
  // const [plotUniqueCombName, setPlotUniqueCombName] =
  //   React.useState<string>("J+KT1");
  // const [uniqueCombsChecked, setUniqueCombsChecked] = React.useState<{
  //   [name: string]: boolean;
  //   // }>({ A2: true, A: true, B1: true, J: true, K: true });
  // }>({ J: true, KT1: true });
  // const [classChecked, setClassChecked] = React.useState<string>("all");
  const [showSQ, setShowSQ] = React.useState<boolean>(false);
  // const [showEE, setShowEE] = React.useState<boolean>(false);
  const [showTable, setShowTable] = React.useState<boolean>(true);
  const [stats, setStats] = React.useState(statsAll);

  // React.useEffect(() => {
  //   if (classChecked === "all") {
  //     setStats(statsAll);
  //   } else if (classChecked === "a") {
  //     setStats((stats) => ({ ...stats, unique: statsA.unique }));
  //   } else if (classChecked === "n") {
  //     setStats((stats) => ({ ...stats, unique: statsN.unique }));
  //   }
  // }, [classChecked]);

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
            ]. For statistics of the polynomials, see{" "}
            <Link href="/stats" inPlace>
              Stats
            </Link>
            .
          </Typography>
          <Radios
            options={Object.keys(stats).map((k) => ({ name: k, value: k }))}
            value={plotName}
            onChange={(e) => setPlotName((e.target as HTMLInputElement).value)}
          />
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
        {/* <Line
          data={(() => {
            const abbr = stats[plotName].abbreviate;
            const output = stats[plotName][
              abbr ? "columnsAbbr" : "columns" // when to abbreviate
            ].map((name, i) => ({
              x: stats[plotName].x,
              y: stats[plotName].ys?.[i] || [],
              name: name,
            }));

            { /* TODO: Add more for other classChecked * / }
            // if (plotName === "unique" && classChecked === "all") {
            //   output.push({
            //     x: statsAllComb(plotUniqueCombName).map((_, i) => i + 3),
            //     y: statsAllComb(plotUniqueCombName),
            //     name: plotUniqueCombName,
            //   });
            // }
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
        /> */}
        <Plot
          data={[
            ...(() => {
              const abbr = stats[plotName].abbreviate;
              const output = stats[plotName][
                abbr ? "columnsAbbr" : "columns" // when to abbreviate
              ].map((name, i) => ({
                x: stats[plotName].x,
                y: stats[plotName].ys?.[i] || [],
                name: name,
                mode: "lines+markers",
              }));

              {
                /* TODO: Add more for other classChecked */
              }
              // if (plotName === "unique" && classChecked === "all") {
              //   output.push({
              //     x: statsAllComb(plotUniqueCombName).map((_, i) => i + 3),
              //     y: statsAllComb(plotUniqueCombName),
              //     name: plotUniqueCombName,
              //   });
              // }
              return output;
            })(),
            {
              name: "Count",
              z: [
                [
                  16, 0, 1, 6, 21, 31, 62, 74, 126, 250, 398, 800, 1378, 2487,
                  4306, 7625, 13027, 21766, 35697, 55226, 82354, 116235, 152038,
                  183785, 203015, 199178, 178472, 146039, 110068, 80652, 53104,
                  31720, 15126, 5304, 1320, 210, 17, 1,
                ],
              ],
              type: "heatmap",
              yaxis: "y2",
              showscale: false,
              hoverinfo: "z+x+name",
            },
          ]}
          config={{
            scrollZoom: true,
          }}
          layout={{
            dragmode: "pan",
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
              domain: [0.03, 1],
            },
            yaxis2: {
              domain: [0, 0.03],
              visible: false,
            },
            // legend: { ...stats[plotName].legend },
            grid: {
              rows: 2,
              columns: 1,
              subplots: ["xy", "xy2"],
            },
          }}
          style={{ maxWidth: `${1200}px`, height: 900, margin: "0 auto" }}
        />
        {/* [16,0,1,6,21,31,62,74,126,250,398,800,1378,2487,4306,7625,13027,21766,35697,55226,82354,116235,152038,183785,203015,199178,178472,146039,110068,80652,53104,31720,15126,5304,1320,210,17,1] */}

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

        {/* TODO: Add more for other classChecked */}
        {/*plotName === "unique" && classChecked === "all" && (
          <>
            <Typography variant="body1">
              Choose your own combination:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Checkboxes
                options={stats["unique"].columnsAbbr.map((k) => ({
                  name: k,
                  value: k,
                }))}
                checked={uniqueCombsChecked}
                disabled={{ BNvdV: true, "A+BNvdV": true }}
                onChange={(name, e) =>
                  setUniqueCombsChecked(
                    (obj) =>
                      ({
                        ...obj,
                        [name]: (e.target as HTMLInputElement).checked,
                      } as { [name: string]: boolean })
                  )
                }
              />
              {/* TODO: A help dialogue for which combinations are cool * /}
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  setPlotUniqueCombName(
                    stats["unique"].columnsAbbr
                      .filter((name) => uniqueCombsChecked[name])
                      .join("+")
                  )
                }
                disabled={
                  Object.values(uniqueCombsChecked).filter((v) => v).length < 2
                }
                disableElevation
              >
                Change
              </Button>
            </Box>
          </>
        )*/}
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

                      /* TODO: Add more for other classChecked */
                      // ...(plotName === "unique" && classChecked === "all"
                      //   ? [[plotUniqueCombName, plotUniqueCombName]]
                      //   : []),
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

                    {/* TODO: Add more for other classChecked */}
                    {/* For combs */}
                    {/* {plotName === "unique" && classChecked === "all" && (
                      <TableCell key={`row${i},col;combs`}>
                        {isNaN(statsAllComb(plotUniqueCombName)[i])
                          ? "-"
                          : statsAllComb(plotUniqueCombName)[i]}
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <Accordion title="Abbreviations">
        <Typography variant="body1">
          The following table describes the abbreviations used in some of the
          plots. For convenience, they may also be attained by hovering over the
          headings in the data table above.
        </Typography>
        <TableContainer
          sx={{
            margin: "1em auto",
            border: "1px solid lightgrey",
            borderRadius: "5px",
            width: "fit-content",
          }}
        >
          <Table size="small" sx={{ width: "auto" }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f0f0f0",
                }}
              >
                <TableCell
                  sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                  align="right"
                >
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "600", borderBottomWidth: "3px" }}>
                  Abbreivation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats[plotName].columns.map((col, i) => (
                <TableRow key={`abbrTable-row${i}`}>
                  <TableCell key={`abbrTable-row${i},col${0}`} align="right">
                    {col}
                  </TableCell>
                  <TableCell key={`abbrTable-row${i},col${1}`}>
                    {stats[plotName].columnsAbbr[i]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Accordion>
    </Container>
  );
}
