"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { min, max } from "../../scripts/minmax";
import { Shape } from "plotly.js";

function zeros(rows: number, cols: number) {
  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));
}

function pointsToImage(
  points: Array<[number, number]>,
  width: number,
  height: number,
  min_x: number,
  max_x: number,
  min_y: number,
  max_y: number,
  brightness = 1
) {
  const img = zeros(height, width);
  points.forEach((p) => {
    const x = p[0];
    const y = p[1];
    if (x >= min_x && x <= max_x && y >= min_y && y <= max_y) {
      const ix = Math.floor(((x - min_x) / (max_x - min_x)) * (width - 1));
      const iy = Math.floor(((y - min_y) / (max_y - min_y)) * (height - 1));
      img[iy][ix] += brightness;
    }
  });
  return img;
}

export function Roots({
  roots,
  width = 1000,
  height = 1000,
  minX = -5,
  maxX = 5,
  minY = -5,
  maxY = 5,
  showCircle = true,
  zmax = 500,
}: {
  roots: Array<[number, number]>;
  width?: number;
  height?: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  showCircle?: boolean;
  zmax?: number;
}) {
  // const min_x = min(roots.map(([x, y]) => x));
  // const max_x = max(roots.map(([x, y]) => x));
  // const min_y = min(roots.map(([x, y]) => y));
  // const max_y = max(roots.map(([x, y]) => y));
  // const maxsize = Math.sqrt(max(roots.map(([x, y]) => x * x + y * y)));
  // minX = -maxsize;
  // maxX = maxsize;
  // minY = -maxsize;
  // maxY = maxsize;

  const image = pointsToImage(roots, width, height, minX, maxX, minY, maxY);
  // console.log(image);

  return (
    <div>
      <Plot
        data={[
          {
            z: image,
            type: "heatmap",
            colorscale: "Hot",
            // colorscale: "Blackbody",
            zmin: 0,
            zmax: zmax,
          },
        ]}
        config={{
          scrollZoom: true,
        }}
        layout={{
          width: 1000,
          height: 1000,
          title: "Roots",
          shapes: showCircle
            ? [
                {
                  type: "circle",
                  xref: "x",
                  yref: "y",
                  x0: Math.floor(((-1 - minX) / (maxX - minX)) * (width - 1)),
                  y0: Math.floor(((-1 - minY) / (maxY - minY)) * (height - 1)),
                  x1: Math.floor(((1 - minX) / (maxX - minX)) * (width - 1)),
                  y1: Math.floor(((1 - minY) / (maxY - minY)) * (height - 1)),
                  line: {
                    color: "rgba(144, 238, 144, 0.4)",
                    width: 5,
                  },
                },
              ]
            : [],
        }}
      />
    </div>
  );
}

export function shapeCircle(
  zero: [number, number],
  radius: number
): Partial<Shape> {
  return {
    type: "circle",
    xref: "x",
    yref: "y",
    x0: zero[0] - radius,
    y0: zero[1] - radius,
    x1: zero[0] + radius,
    y1: zero[1] + radius,
    line: {
      color: "rgba(144, 238, 144, 0.4)",
      width: 5,
    },
  };
}

export default function Grid({
  grid,
  shapes = [],
  zmax = 500,
  width = 800,
  height = 800,
}: {
  grid: Array<Array<number>>;
  shapes?: Partial<Shape>[];
  zmax?: number;
  width?: number;
  height?: number;
}) {
  return (
    <div>
      <Plot
        data={[
          {
            z: grid,
            type: "heatmap",
            // colorscale: "Hot",
            colorscale: "Blackbody",
            zmin: 0,
            zmax: zmax,
          },
        ]}
        config={{
          scrollZoom: true,
        }}
        layout={{
          dragmode: "pan",
          width: width,
          height: height,
          shapes: shapes,
        }}
      />
    </div>
  );
}
