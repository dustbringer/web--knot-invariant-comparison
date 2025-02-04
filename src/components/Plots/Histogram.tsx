"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Histogram({
  data,
  width = 1000,
  height = 1000,
  nbins = 20,
  layout = {},
}: {
  data: Array<{
    x: Array<number>;
    name?: string;
  }>;
  width?: number;
  height?: number;
  nbins?: number;
  layout?: object;
}) {
  return (
    <div>
      <Plot
        data={data.map((d, i) => ({ type: "histogram", nbinsx: nbins, ...d }))}
        config={{
          scrollZoom: true,
        }}
        layout={{
          width: width,
          height: height,
          bargap: 0.25,
          ...layout,
        }}
      />
    </div>
  );
}
