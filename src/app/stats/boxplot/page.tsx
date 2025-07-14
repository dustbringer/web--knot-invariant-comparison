"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Typography from "@mui/material/Typography";

import Container from "@/components/Container";
import Link from "@/components/Link";

import staticify from "@/util/staticURLs";

export default function StatsBoxPlotPage() {
  const [data, setData] = React.useState<
    Array<{ name?: string; y: Array<number> }>
  >([]);
  React.useEffect(() => {
    Promise.all([
      fetch(staticify(`/static/time/knot-a2-3-14-time-wolfram.out`)),
      fetch(staticify(`/static/time/knot-alexander-3-14-time-wolfram.out`)),
      fetch(staticify(`/static/time/knot-b1-3-14-time-wolfram.out`)),
      fetch(staticify(`/static/time/knot-b1-3-14-time-js.out`)),
      fetch(staticify(`/static/time/knot-jones-3-14-time-wolfram.out`)),
      fetch(staticify(`/static/time/knot-jones-3-14-time-js.out`)),
      fetch(staticify(`/static/time/knot-khovanov-3-14-time-wolfram.out`)),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        const names = [
          "A2",
          "Alexander",
          "B1 (R-matrix)",
          "B1 (Skein theory)",
          "Jones (R-matrix)",
          "Jones (Skein theory)",
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
    <Container maxWidth="md">
      <Typography variant="body1">
        A <Link href="https://en.wikipedia.org/wiki/Box_plot">boxplot</Link> of
        computation times for knots up to 14 crossings.
      </Typography>
      {/* A Box plot */}
      <Plot
        data={data.map((d) => ({ ...d, type: "box" }))}
        config={{
          scrollZoom: true,
          responsive: true,
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
        style={{ margin: "0 auto", width: "100%", height: "100%" }}
      />
      <Typography variant="body1">
        The vertical axis has a logarithmic scale, so too-small-to-be-non-zero
        time values fall off the bottom.
      </Typography>
    </Container>
  );
}
