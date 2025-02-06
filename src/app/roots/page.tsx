"use client";

import * as React from "react";

import Grid, { Roots as RootsPlot, shapeCircle } from "@/components/Plots/Grid";
import Range from "@/components/Range";
import Container from "@/components/Container";

import staticify from "@/util/staticURLs";
import Radio from "@/components/Radio";

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
  const [type, setType] = React.useState<string>("b1"); // a2, alexander, b1, jones, khovanov-t1
  const [resolution, setResolution] = React.useState<string>("full"); // full, near
  const [sliderValue, setSliderValue] = React.useState<number>(7000);
  const [circle, setCircle] = React.useState<{
    zero: [number, number];
    radius: number;
  }>({ zero: [0, 0], radius: 0 });
  const [grid, setGrid] = React.useState<Array<Array<number>>>([]);

  React.useEffect(() => {
    fetch(
      staticify(
        `/static/root-grid/knot-${type}-3-16-rootsgridsparse-1000x1000-${resolution}.out`
      )
    )
      // fetch(staticify(`/static/root-grid/knot-${type}-3-16-rootsgridsparse-1000x1000-near.out`))
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
  }, [type, resolution]);

  return (
    <Container>
      <Radio
        title="Type"
        options={[
          { name: "A2", value: "a2" },
          { name: "Alexander", value: "alexander" },
          { name: "B1", value: "b1" },
          { name: "Jones", value: "jones" },
          { name: "KhovanovT1", value: "khovanov-t1" },
        ]}
        value={type}
        onChange={(e) => setType((e.target as HTMLInputElement).value)}
      />
      <Radio
        title="Resolution"
        options={[
          { name: "Full", value: "full" },
          { name: "Near", value: "near" },
        ]}
        value={resolution}
        onChange={(e) => setResolution((e.target as HTMLInputElement).value)}
      />
      Brightness (lower = brighter)
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
