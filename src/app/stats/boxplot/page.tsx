"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Container from "@/components/Container";

export default function StatsBoxPlotPage() {
  const [data, setData] = React.useState<
    Array<{ name?: string; y: Array<number> }>
  >([]);
  React.useEffect(() => {
    Promise.all([
      fetch(`/time/knot-a2-3-14-time-wolfram.out`),
      fetch(`/time/knot-alexander-3-14-time-wolfram.out`),
      fetch(`/time/knot-b1-3-14-time-wolfram.out`),
      fetch(`/time/knot-b1-3-14-time-js.out`),
      fetch(`/time/knot-jones-3-14-time-wolfram.out`),
      fetch(`/time/knot-khovanov-3-14-time-wolfram.out`),
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

  return (
    <Container>
      {/* A Box plot */}
      <Plot
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
      />
    </Container>
  );
}
