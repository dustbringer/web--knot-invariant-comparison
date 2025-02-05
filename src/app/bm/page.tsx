"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

import * as d3 from "d3";

import Container from "@/components/Container";
import createGraphSVG, { colors as nodeColors, rgbToText } from "./graph-svg";
import { Button } from "@mui/material";

type NodeDatum = {
  id: number;
  size?: number;
  group: number;
} & d3.SimulationNodeDatum;
type LinkDatum = { value?: number } & d3.SimulationLinkDatum<NodeDatum>;

type SVGData = {
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>;
  node: d3.Selection<
    d3.BaseType | SVGCircleElement,
    NodeDatum,
    SVGGElement,
    undefined
  >;
  link: d3.Selection<
    d3.BaseType | SVGLineElement,
    LinkDatum,
    SVGGElement,
    undefined
  >;
  drag: d3.DragBehavior<SVGSVGElement, undefined, undefined>;
  zoom: d3.ZoomBehavior<SVGSVGElement, undefined>;
};

function lerp(start: number, end: number, value: number) {
  return start * (1 - value) + end * value;
}

function colorLerp(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  value: number
): [number, number, number] {
  const colorVal = (prop: number) => lerp(rgb1[prop], rgb2[prop], value);
  return [colorVal(0), colorVal(1), colorVal(2)];
}

export default function BallmapperPage() {
  const [bmLinks, setBmLinks] = React.useState<Array<LinkDatum>>([]);
  const [bmNodes, setBmNodes] = React.useState<Array<NodeDatum>>([]);
  const [bmPCBL, setBmPCBL] = React.useState<Array<Array<number>>>([]);
  const [bmMaxNodeSize, setBmMaxNodeSize] = React.useState<number>(0);
  const [lassoEnabled, setLassoEnabled] = React.useState<boolean>(false);
  const [svgRef, setSvgRef] = React.useState<HTMLDivElement | null>(null);
  const [svgData, setSvgData] = React.useState<SVGData>();
  const [selected, setSelected] = React.useState<{ [n: number]: boolean }>({});

  const [bmCmpLinks, setBmCmpLinks] = React.useState<Array<LinkDatum>>([]);
  const [bmCmpNodes, setBmCmpNodes] = React.useState<Array<NodeDatum>>([]);
  const [bmCmpPCBL, setBmCmpPCBL] = React.useState<Array<Array<number>>>([]);
  const [bmCmpMaxNodeSize, setBmCmpMaxNodeSize] = React.useState<number>(0);
  const [svgCmpRef, setSvgCmpRef] = React.useState<HTMLDivElement | null>(null);
  const [svgCmpData, setSvgCmpData] = React.useState<SVGData>();

  const inType = "jones";
  React.useEffect(() => {
    Promise.all([
      fetch(`public-data/bm/bm-${inType}.edge.out`),
      fetch(`public-data/bm/bm-${inType}.pcbl.out`),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        console.log("got it");
        const lines = res[0]
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        const PCBL = res[1]
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        const sizes = PCBL.map((line) => line.length);

        setBmPCBL(PCBL.map((line) => line.map(Number)));
        setBmMaxNodeSize(Math.max(...sizes));
        setBmNodes(
          Array.from(Array(PCBL.length).keys()).map((i) => ({
            id: i + 1,
            group: 0,
            size: sizes[i],
          }))
        );

        setBmLinks(
          lines.map((edge) => ({
            source: Number(edge[0]),
            target: Number(edge[1]),
            value: 1,
          }))
        );

        console.log("done loading");
      });
  }, []);

  const cmpType = "alexander";
  React.useEffect(() => {
    Promise.all([
      fetch(`public-data/bm/bm-${cmpType}.edge.out`),
      fetch(`public-data/bm/bm-${cmpType}.pcbl.out`),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        console.log("got it");
        const lines = res[0]
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        const PCBL = res[1]
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        const sizes = PCBL.map((line) => line.length);

        setBmCmpPCBL(PCBL.map((line) => line.map(Number)));
        setBmCmpMaxNodeSize(Math.max(...sizes));
        setBmCmpNodes(
          Array.from(Array(PCBL.length).keys()).map((i) => ({
            id: i + 1,
            group: 0,
            size: sizes[i],
          }))
        );

        setBmCmpLinks(
          lines.map((edge) => ({
            source: Number(edge[0]),
            target: Number(edge[1]),
            value: 1,
          }))
        );

        console.log("done loading");
      });
  }, []);

  React.useEffect(() => {
    if (bmNodes.length === 0) {
      // stops accidentally rendering nothing (after rendering the correct thing)
      return;
    }

    const { svg, node, link, drag, zoom } = createGraphSVG({
      inputNodes: bmNodes,
      inputLinks: bmLinks,
      width: 800,
      height: 800,
      maxNodeSize: bmMaxNodeSize,
      setSelected,
    });
    setSvgData({ svg, node, link, drag, zoom });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgRef?.replaceChildren(svg.node() || "Ballmapper loaded with error...");
  }, [svgRef, bmNodes, bmLinks, bmMaxNodeSize]);

  React.useEffect(() => {
    const drag = svgData?.drag;
    const zoom = svgData?.zoom;
    if (!drag || !zoom) {
      return;
    }
    if (lassoEnabled) {
      drag.filter((e: DragEvent) => !e.ctrlKey && !e.shiftKey && !e.button);
      zoom.filter(
        (e) => ((e.ctrlKey || e.shiftKey) && !e.button) || e.type === "wheel"
      );
    } else {
      drag.filter((e: DragEvent) => (e.ctrlKey || e.shiftKey) && !e.button);
      zoom.filter(
        (e) => (!e.ctrlKey && !e.shiftKey && !e.button) || e.type === "wheel"
      );
    }
  }, [lassoEnabled, svgData]);

  React.useEffect(() => {
    if (bmCmpNodes.length === 0) {
      // stops accidentally rendering nothing (after rendering the correct thing)
      return;
    }

    const { svg, node, link, drag, zoom } = createGraphSVG({
      inputNodes: bmCmpNodes,
      inputLinks: bmCmpLinks,
      width: 800,
      height: 800,
      maxNodeSize: bmCmpMaxNodeSize,
      setSelected: () => {},
      disableLasso: true,
    });
    setSvgCmpData({ svg, node, link, drag, zoom });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgCmpRef?.replaceChildren(svg.node() || "Ballmapper loaded with error...");
  }, [svgCmpRef, bmCmpNodes, bmCmpLinks, bmCmpMaxNodeSize]);

  const transferSelected = () => {
    console.log(selected);
    const pcbl: { [index: number]: boolean } = {};
    Object.keys(selected).forEach((n) =>
      bmPCBL[Number(n) - 1].forEach((n) => {
        pcbl[n] = true;
      })
    );
    const sizes: { [index: number]: number } = {};
    bmCmpNodes.forEach(
      (d) =>
        (sizes[d.id] =
          bmCmpPCBL[Number(d.id) - 1].filter((n) => pcbl[n]).length /
          (d.size || 1))
    );
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr("fill", (d) =>
        rgbToText(colorLerp(nodeColors[0], nodeColors[1], sizes[d.id]))
      );
    console.log(sizes);
  };

  // TODO: Add a reset button
  return (
    <Container>
      <div>
        <Switch
          checked={lassoEnabled}
          onChange={(e) => setLassoEnabled(e.target.checked)}
        />
        Lasso
      </div>
      <Box
        sx={{
          // border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div ref={(node) => setSvgRef(node)} />
      </Box>
      <Button
        variant="contained"
        sx={{ width: "100px" }}
        onClick={transferSelected}
      >
        Transfer!
      </Button>
      <Box
        sx={{
          // border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div ref={(node) => setSvgCmpRef(node)} />
      </Box>
    </Container>
  );
}
