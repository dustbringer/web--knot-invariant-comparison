"use client";

import * as React from "react";

import Grid, { Roots as RootsPlot, shapeCircle } from "@/components/Plots/Grid";
import Range from "@/components/Range";
import Container from "@/components/Container";

// Fast fill with zeros
function zeros(n: number) {
  if (n <= 0) {
    return [];
  }
  let arr: Array<number>;
  (arr = []).length = n;
  arr.fill(0);
  return arr;
}
function zeros2(x: number, y: number) {
  if (x < 0 || y < 0) {
    return [];
  }
  let arr: Array<Array<number>>;
  (arr = []).length = x;
  for (let i = 0; i < x; i++) {
    arr[i] = zeros(y);
  }
  return arr;
}

export default function RootsPage() {
  const [sliderValue, setSliderValue] = React.useState<number>(7000);
  const [circle, setCircle] = React.useState<{
    zero: [number, number];
    radius: number;
  }>({ zero: [0, 0], radius: 0 });
  const [grid, setGrid] = React.useState<Array<Array<number>>>([]);
  const type = "b1";
  React.useEffect(() => {
    fetch(`/public-data/root-grid/knot-${type}-3-16-rootsgridsparse-1000x1000-full.out`)
      // fetch(`/public-data/root-grid/knot-${type}-3-16-rootsgridsparse-1000x1000-near.out`)
      .then((res) => res.json())
      .then((res) => {
        console.log("Roots started processing");
        const grid = zeros2(res.width, res.height);
        Object.keys(res.gridSparse).forEach((key) => {
          const [x, y] = key.split(",").map(Number);
          grid[y][x] = res.gridSparse[key]; // x,y flipped because that's how plotly likes it
        });

        setCircle({ zero: res.circleCentre, radius: res.circleRadius });
        setGrid(grid);
        console.log("Roots finished processing");
      });
  }, []);

  return (
    <Container>
      <Range
        min={1}
        max={10000}
        value={sliderValue}
        onChange={(e) =>
          setSliderValue(Number((e.target as HTMLInputElement)?.value || 1))
        }
      />
      {/* <RootsPlot roots={roots} width={800} height={800} zmax={2000} /> */}
      <Grid
        grid={grid}
        shapes={[shapeCircle(circle.zero, circle.radius)]}
        zmax={sliderValue}
      />
    </Container>
  );
}
