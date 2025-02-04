"use client";

import * as React from "react";

import Switch from "@mui/material/Switch";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Container from "@/components/Container";
import Radio from "@/components/Radio";
import Histogram from "@/components/Plots/Histogram";
import Line from "@/components/Plots/Line";
import stats from "./stats";

export default function StatsPage() {
  const [plotName, setPlotName] = React.useState<string>("unique");
  const [showSQ, setShowSQ] = React.useState<boolean>(false);
  const [showEE, setShowEE] = React.useState<boolean>(false);

  // const [dataPairs, setDataPairs] = React.useState<
  //   Array<{ x: Array<number>; name?: string }>
  // >([]);
  // const [dataUnique, setDataUnique] = React.useState<
  //   Array<{ x: Array<number>; y: Array<number>; name?: string }>
  // >([]);

  const [data, setData] = React.useState<
    Array<{ name?: string; y: Array<number> }>
  >([]);
  React.useEffect(() => {
    Promise.all([
      fetch(`time/knot-a2-3-14-time-wolfram.out`),
      fetch(`time/knot-alexander-3-14-time-wolfram.out`),
      fetch(`time/knot-b1-3-14-time-wolfram.out`),
      fetch(`time/knot-b1-3-14-time-js.out`),
      fetch(`time/knot-jones-3-14-time-wolfram.out`),
      fetch(`time/knot-khovanov-3-14-time-wolfram.out`),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        const names = [
          "A2",
          "Alexander",
          "B1 (R-matrix)",
          "B1 (Skein theory)",
          "Jones",
          "Khovanov",
        ];
        setData(
          res.map((text, i) => ({
            y: text.split("\n").map(Number),
            name: names[i],
          }))
        );
      });
  }, []);

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

  return (
    <Container>
      <div>
        <Radio
          options={Object.keys(stats).map((k) => ({ name: k, value: k }))}
          value={plotName}
          onChange={(e) => setPlotName((e.target as HTMLInputElement).value)}
        />
        <div>
          <Switch
            checked={showSQ}
            onChange={(e) => setShowSQ(e.target.checked)}
          />
          Successive quotients
        </div>
        <div>
          <Switch
            checked={showEE}
            onChange={(e) => setShowEE(e.target.checked)}
          />
          Effective exponents
        </div>
      </div>

      {/* <Histogram
        data={dataPairs}
        width={800}
        height={600}
        layout={{
          xaxis: {
            title: "Number of comparisons",
          },
          yaxis: {
            title: "Frequency",
          },
          legend: {
            yanchor: "top",
            y: 0.99,
            xanchor: "right",
            x: 0.99,
          },
        }}
      />*/}
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
        />
      )}
      {showEE && (
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
        />
      )}

      {/* A Box plot */}
      {/* <Plot
        data={data.map((d) => ({ ...d, type: "box" }))}
        config={{
          scrollZoom: true,
        }}
        layout={{
          width: 800,
          height: 600,

          xaxis: {
            title: "Invariant",
            linecolor: "black",
            linewidth: 2,
          },
          yaxis: {
            title: "Time (s) (log scale)",
            linecolor: "black",
            linewidth: 2,
            type: "log",
          },
        }}
      /> */}
    </Container>
  );
}
