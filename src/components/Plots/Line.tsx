"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
import { Layout } from "plotly.js";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Line({
  data,
  width = 1000,
  height = 1000,
  nbins = 20,
  layout = {},
}: {
  data: Array<{
    x: Array<number>;
    y: Array<number>;
    name?: string;
    mode?: string;
  }>;
  width?: number;
  height?: number;
  nbins?: number;
  layout?: Partial<Layout>;
}) {
  return (
    <div>
      <Plot
        data={data.map((d, i) => ({ mode: "lines+markers", ...d }))}
        config={{
          scrollZoom: true,
        }}
        layout={{
          dragmode: "pan",
          width: width,
          height: height,
          ...layout,
        }}
      />
    </div>
  );
}
