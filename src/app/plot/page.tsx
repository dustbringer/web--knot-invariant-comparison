"use client";

import * as React from "react";

import { styled } from "@mui/material";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

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
// import stats from "./stats";
import Accordion from "../../components/Accordion";

import staticify from "@/util/staticURLs";

function range(start: number, end: number) {
  return [...Array(end - start).keys()].map((i) => i + start);
}

export default function PlotPage() {
  const [text, setText] = React.useState<string>(`[\n  []\n]\n`);
  const [textSQ, setTextSQ] = React.useState<string>("");
  const [textEE, setTextEE] = React.useState<string>("");
  const [data, setData] = React.useState<
    Array<{ name?: string; y: Array<number> }>
  >([]);
  const [yLog, setYLog] = React.useState<boolean>(false);
  const [startSkip, setStartSkip] = React.useState<[number, number]>([0, 1]);

  const effectiveExponents = (arr: Array<number>) => {
    const ret = [];
    for (let i = 0; i < arr.length - 1; i++) {
      ret.push(
        (Math.log(arr[i]) - Math.log(arr[i + 1])) /
          (Math.log(i) - Math.log(i + 1))
      );
    }
    return ret;
  };

  const successiveQuotients = (arr: Array<number>) => {
    const ret = [];
    for (let i = 0; i < arr.length - 1; i++) {
      ret.push(arr[i + 1] / arr[i]);
    }
    return ret;
  };

  const handlePlot = () => {
    const newData: Array<{ name?: string; y: Array<number> }> = [
      ...JSON.parse(text).map((arr: Array<number>, i: number) => ({
        name: `${i}`,
        y: arr,
      })),
      ...(textSQ.length > 0
        ? JSON.parse(textSQ).map((arr: Array<number>, i: number) => ({
            name: `SQ${i}`,
            y: successiveQuotients(arr),
          }))
        : []),
      ...(textEE.length > 0
        ? JSON.parse(textEE).map((arr: Array<number>, i: number) => ({
            name: `EE${i}`,
            y: effectiveExponents(arr),
          }))
        : []),
    ];
    console.log(newData);
    setData(newData);
  };

  return (
    <Container maxWidth="md">
      <Line
        data={data.map((d, i) => ({
          x: range(0, d.y.length).map((n) => startSkip[0] + n * startSkip[1]),
          // y: arr.map((n) => Math.abs(n) + 0.01),
          y: yLog ? d.y.map((n) => n + 0.000001) : d.y,
          name: d.name,
        }))}
        width={800}
        height={800}
        layout={{
          xaxis: {
            linecolor: "black",
            linewidth: 2,
          },
          yaxis: {
            linecolor: "black",
            linewidth: 2,
            type: yLog ? "log" : "linear",
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          disableElevation
          sx={{ margin: "5px 0" }}
          onClick={handlePlot}
        >
          <KeyboardDoubleArrowUpIcon />
        </Button>
      </Box>
      <Accordion title="Line">
        <TextField
          label="Input"
          rows={6}
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
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Accordion>
      <Accordion title="Effective Exponents">
        <TextField
          label="Input"
          rows={6}
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
          value={textEE}
          onChange={(e) => setTextSQ(e.target.value)}
        />
        <Button
          variant="contained"
          disableElevation
          sx={{ margin: "5px 0" }}
          onClick={(e) => setTextSQ(text)}
        >
          Copy from Line
        </Button>
      </Accordion>
      <Accordion title="Successive Quotients">
        <TextField
          label="Input"
          rows={6}
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
          value={textSQ}
          onChange={(e) => setTextEE(e.target.value)}
        />
        <Button
          variant="contained"
          disableElevation
          sx={{ margin: "5px 0" }}
          onClick={(e) => setTextEE(text)}
        >
          Copy from Line
        </Button>
      </Accordion>
      <Accordion title="Settings">
        <div>
          y-log{" "}
          <Switch
            title="y-log"
            value={yLog}
            onChange={(e) => setYLog(e.target.checked)}
          />
        </div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          x start/skip{" "}
          <TextField
            label="Start"
            type="number"
            margin="dense"
            size="small"
            sx={{ margin: "0 5px" }}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: "Roboto Mono",
                },
              },
            }}
            value={startSkip[0]}
            onChange={(e) =>
              setStartSkip([Number(e.target.value), startSkip[1]])
            }
          />
          <TextField
            label="Skip"
            type="number"
            margin="dense"
            size="small"
            sx={{ margin: "0 5px" }}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: "Roboto Mono",
                },
              },
            }}
            value={startSkip[1]}
            onChange={(e) =>
              setStartSkip([startSkip[0], Number(e.target.value)])
            }
          />
        </Box>
      </Accordion>
    </Container>
  );
}
