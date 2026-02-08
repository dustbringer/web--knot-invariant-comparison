"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import * as d3 from "d3";

import Container from "@/components/Container";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";
import Radios from "@/components/Radios";

import { max, min, range } from "@/util/array-util";
import staticify from "@/util/staticURLs";

const options: {
  [name: string]: {
    display: string;
    diameter: number;
  };
} = {
  ["a2-3-13"]: { display: "A2", diameter: 75.39312392960626 },
  ["alexander-3-13"]: { display: "Alexander", diameter: 529.0387509436338 },
  ["b1-3-13"]: { display: "B1", diameter: 7948.795560458289 },
  ["bnvdv-3-13"]: { display: "BV", diameter: 5913715.684034101 },
  ["hfk2-3-13"]: { display: "HFK2", diameter: 375.09383149869484 },
  ["hfk2-t1-3-13"]: { display: "HFK2T1", diameter: 268.07461647832304 },
  ["homflypt-3-13"]: { display: "HOMFLYPT", diameter: 271.03892912038185 },
  ["homflypt-homology-3-11"]: {
    display: "HOMFLYPTHomology-3-11",
    diameter: 71.21215973736813,
  },
  ["jones-3-13"]: { display: "Jones", diameter: 427.95068194444264 },
  ["khovanov-3-13"]: { display: "Khovanov", diameter: 216.80789099204472 },
  ["khovanov-t1-3-13"]: { display: "KhovanovT1", diameter: 254.13754925135822 },
  ["khodd-3-13"]: { display: "KhovanovOdd", diameter: 312.5913610432112 },
  ["kr3-3-13"]: { display: "KR3", diameter: 293.30109914926936 },
  ["v1-3-13"]: { display: "V1", diameter: 86974.97632205728 },
  ["v2-3-13"]: { display: "V2", diameter: 33747487.106025 },
};

export default function PersistentHomologyPage() {
  const savedPH = React.useRef<{
    [inv: string]: {
      h0: Array<[number, number]>;
      h1: Array<[number, number]>;
      h0Inf: Array<[number, number]>;
      h1Inf: Array<[number, number]>;
      plotMax: number;
    };
  }>({});
  const [phInv1, setPhInv1] = React.useState<string>("b1-3-13");
  const [phInv2, setPhInv2] = React.useState<string>("jones-3-13");

  // Plot
  const [revise, setRevise] = React.useState<number>(0);
  const [plotMax, setPlotMax] = React.useState<number>(0);

  React.useEffect(() => {
    Promise.resolve()
      .then(() => setRevise(0))
      .then(() => {
        if (savedPH.current[phInv1] === undefined) {
          console.log(`Fetching ph data for ${phInv1}`);
          return Promise.all([
            fetch(
              staticify(
                `/static/persistent-homology/points-${phInv1}-pca15.h0.out`,
              ),
            ),
            fetch(
              staticify(
                `/static/persistent-homology/points-${phInv1}-pca15.h1.out`,
              ),
            ),
          ])
            .then((res) => Promise.all(res.map((r) => r.text())))
            .then((res) => {
              const h0 = res[0]
                .split("\n")
                .map(
                  (line) =>
                    line
                      .split(";")
                      .map((nStr) =>
                        nStr === "inf" ? Infinity : Number(nStr),
                      ) as [number, number],
                );
              const h1 = res[1]
                .split("\n")
                .map(
                  (line) =>
                    line
                      .split(";")
                      .map((nStr) =>
                        nStr === "inf" ? Infinity : Number(nStr),
                      ) as [number, number],
                );

              const h0maxX = max(
                h0
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([x, _]) => x),
              );
              const h0maxY = max(
                h0
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([_, y]) => y),
              );
              const h1maxX = max(
                h1
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([x, _]) => x),
              );
              const h1maxY = max(
                h1
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([_, y]) => y),
              );
              savedPH.current[phInv1] = {
                h0: h0.filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity),
                h1: h1.filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity),
                h0Inf: h0.filter(
                  (xy) => xy[0] === Infinity || xy[1] === Infinity,
                ),
                h1Inf: h1.filter(
                  (xy) => xy[0] === Infinity || xy[1] === Infinity,
                ),
                plotMax: max([h0maxX, h1maxX, h0maxY, h1maxY]),
              };
              return savedPH.current[phInv1];
            });
        } else {
          return Promise.resolve(savedPH.current[phInv1]);
        }
      })
      .finally(() => {
        console.log("Done");
        setRevise(1);
      });
  }, [phInv1]);

  React.useEffect(() => {
    Promise.resolve()
      .then(() => setRevise(2))
      .then(() => {
        if (savedPH.current[phInv2] === undefined) {
          console.log(`Fetching ph data for ${phInv2}`);
          return Promise.all([
            fetch(
              staticify(
                `/static/persistent-homology/points-${phInv2}-pca15.h0.out`,
              ),
            ),
            fetch(
              staticify(
                `/static/persistent-homology/points-${phInv2}-pca15.h1.out`,
              ),
            ),
          ])
            .then((res) => Promise.all(res.map((r) => r.text())))
            .then((res) => {
              const h0 = res[0]
                .split("\n")
                .map(
                  (line) =>
                    line
                      .split(";")
                      .map((nStr) =>
                        nStr === "inf" ? Infinity : Number(nStr),
                      ) as [number, number],
                );
              const h1 = res[1]
                .split("\n")
                .map(
                  (line) =>
                    line
                      .split(";")
                      .map((nStr) =>
                        nStr === "inf" ? Infinity : Number(nStr),
                      ) as [number, number],
                );

              const h0maxX = max(
                h0
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([x, _]) => x),
              );
              const h0maxY = max(
                h0
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([_, y]) => y),
              );
              const h1maxX = max(
                h1
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([x, _]) => x),
              );
              const h1maxY = max(
                h1
                  .filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity)
                  .map(([_, y]) => y),
              );
              savedPH.current[phInv2] = {
                h0: h0.filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity),
                h1: h1.filter((xy) => xy[0] !== Infinity && xy[1] !== Infinity),
                h0Inf: h0.filter(
                  (xy) => xy[0] === Infinity || xy[1] === Infinity,
                ),
                h1Inf: h1.filter(
                  (xy) => xy[0] === Infinity || xy[1] === Infinity,
                ),
                plotMax: max([h0maxX, h1maxX, h0maxY, h1maxY]),
              };
              return savedPH.current[phInv2];
            });
        } else {
          return Promise.resolve(savedPH.current[phInv2]);
        }
      })
      .finally(() => {
        console.log("Done");
        setRevise(3);
      });
  }, [phInv2]);

  React.useEffect(() => {
    if (revise === 0) {
      return;
    }
    setPlotMax(
      min([
        100,
        max(
          [phInv1, phInv2]
            .map(
              (name) =>
                Number(
                  savedPH.current?.[name]?.plotMax / options[name].diameter,
                ) *
                100 *
                1.2,
            )
            .filter((val) => !isNaN(val)),
        ),
      ]),
    );
    setRevise(0);
  }, [revise]);

  const yLog = false;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Persistent Homology
      </Typography>

      <Typography variant="body1">
        Select invariant for persistence graph.
      </Typography>
      <div
        style={{
          margin: "0.5em",
        }}
      >
        <Radios
          title="First"
          options={Object.entries(options).map(([k, v]) => ({
            name: v.display,
            value: k,
          }))}
          value={phInv1}
          onChange={(e) => setPhInv1((e.target as HTMLInputElement).value)}
        />
        <Radios
          title="Second"
          options={Object.entries(options).map(([k, v]) => ({
            name: v.display,
            value: k,
          }))}
          value={phInv2}
          onChange={(e) => setPhInv2((e.target as HTMLInputElement).value)}
        />
      </div>

      <Plot
        data={[
          {
            x: [-100 * 2, 100 * 2],
            y: [-100 * 2, 100 * 2],
            mode: "lines",
            line: {
              dash: "dot",
              color: "gray",
            },
            // Don't show it as a trace
            showlegend: false,
            hoverinfo: "skip",
          },
          {
            x: [-100 * 2, 100 * 2],
            y: [plotMax, plotMax],
            mode: "lines",
            line: {
              dash: "dot",
              color: "gray",
            },
            // Don't show it as a trace
            // showlegend: false,
            name: "infinity",
            hoverinfo: "skip",
          },
          ...[phInv1, phInv2]
            .map((name) => [
              {
                mode: "markers",
                x: [
                  ...(savedPH.current[name]?.["h0"]?.map(
                    ([x, _]) => (x / options[name].diameter) * 100,
                  ) || []),
                  ...(savedPH.current[name]?.["h0Inf"]?.map(([x, _]) =>
                    x !== Infinity
                      ? (x / options[name].diameter) * 100
                      : plotMax,
                  ) || []),
                ],
                y: [
                  ...(savedPH.current[name]?.["h0"]?.map(
                    ([_, y]) => (y / options[name].diameter) * 100,
                  ) || []),
                  ...(savedPH.current[name]?.["h0Inf"]?.map(([_, y]) =>
                    y !== Infinity
                      ? (y / options[name].diameter) * 100
                      : plotMax,
                  ) || []),
                ],
                name: `${name}-h0`,
              },
              {
                mode: "markers",
                x: [
                  ...(savedPH.current[name]?.["h1"]?.map(
                    ([x, _]) => (x / options[name].diameter) * 100,
                  ) || []),
                  ...(savedPH.current[name]?.["h1Inf"]?.map(([x, _]) =>
                    x !== Infinity
                      ? (x / options[name].diameter) * 100
                      : plotMax,
                  ) || []),
                ],
                y: [
                  ...(savedPH.current[name]?.["h1"]?.map(
                    ([_, y]) => (y / options[name].diameter) * 100,
                  ) || []),
                  ...(savedPH.current[name]?.["h1Inf"]?.map(([_, y]) =>
                    y !== Infinity
                      ? (y / options[name].diameter) * 100
                      : plotMax,
                  ) || []),
                ],
                name: `${name}-h1`,
              },
            ])
            .flat(),
        ]}
        config={{
          scrollZoom: true,
        }}
        layout={{
          dragmode: "pan",
          legend: {
            yanchor: "bottom",
            y: 0.01,
            xanchor: "right",
            x: 0.99,
          },
          colorway: [...d3.schemePaired],
          xaxis: {
            type: "linear",
            zeroline: false,
            range: [-plotMax / 20, plotMax * 1.1],
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            range: [-plotMax / 20, plotMax * 1.1],
          },
          datarevision: revise,
        }}
        useResizeHandler={true}
        style={{ maxWidth: `1000px`, height: `800px` }}
      />
    </Container>
  );
}
