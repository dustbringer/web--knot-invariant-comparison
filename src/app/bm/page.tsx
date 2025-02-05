"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { Box, BreadcrumbsClassKey } from "@mui/material";

import * as d3 from "d3";
// import * as d3lasso from "d3-lasso";

// const d3 = Object.assign(d3Code, { lasso: d3lasso.lasso });
// window.d3 = d3;

import Container from "@/components/Container";

type NodeDatum = {
  id: string;
  size?: number;
  group: number;
} & d3.SimulationNodeDatum;
type LinkDatum = { value?: number } & d3.SimulationLinkDatum<NodeDatum>;

const viewboxSetup = (h: number, w: number) => [-w / 4, -h / 4, w / 2, h / 2];

export default function BallmapperPage() {
  const [bmLinks, setBmLinks] = React.useState<Array<LinkDatum>>([]);
  const [bmNodes, setBmNodes] = React.useState<Array<NodeDatum>>([]);
  const [maxNodeSize, setMaxNodeSize] = React.useState<number>(0);

  let [selected, setSelected] = React.useState<{ [n: number]: boolean }>({});

  const type = "jones";
  React.useEffect(() => {
    Promise.all([
      fetch(`bm/bm-${type}.edge.out`),
      fetch(`bm/bm-${type}.pcbl.out`),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        console.log("got it");
        const lines = res[0]
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        const sizes = res[1]
          .trim()
          .split("\n")
          .map((line) => line.split(" ").length);

        setMaxNodeSize(Math.max(...sizes));
        setBmNodes(
          [...new Set(lines.flat())].map((name) => ({
            id: name,
            group: 0,
            size: sizes[Number(name) - 1],
          }))
        );

        setBmLinks(
          lines.map((edge) => ({ source: edge[0], target: edge[1], value: 1 }))
        );

        console.log("done loading");
      });
  }, []);

  // These get overwritten, so create a copy
  const nodes = bmNodes.map((d) => ({ ...d }));
  const links = bmLinks.map((d) => ({ ...d }));
  // console.log(nodes, links);

  // // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const width = 800;
  const height = 800;

  // Recale everything to be smaller
  const x = d3.scaleLinear().domain([0, width]).range([0, 100]);
  const y = d3.scaleLinear().domain([0, height]).range([0, 100]);
  // const x = d3.scaleLinear().domain([0, width]).range([0, width]);
  // const y = d3.scaleLinear().domain([0, height]).range([0, height]);

  const vb = viewboxSetup(height, width);
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", vb)
    // .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; border: 1px solid black");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-800))
    .force(
      "link",
      d3
        .forceLink<NodeDatum, LinkDatum>(links)
        .id((d) => d.id)
        .distance(20)
        .strength(0.8)
        .iterations(80)
    )
    // Force toward the origin (default)
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .stop();

  // Run the simulation to its end, then draw. default 300
  simulation.tick(100);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => d.value);
  link
    .attr("x1", (d) => x(d.source.x))
    .attr("x2", (d) => x(d.target.x))
    .attr("y1", (d) => y(d.source.y))
    .attr("y2", (d) => y(d.target.y));

  const nodeRadiusMax = 8;
  const nodeRadiusMin = 2;
  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("id", (d) => {
      return "dot-" + d.id;
    })
    .attr(
      "r",
      (d: NodeDatum) =>
        (nodeRadiusMax * (d.size || 1)) / maxNodeSize + nodeRadiusMin
    )
    .attr("fill", (d: NodeDatum) => color(String(d.group)));
  node.attr("cx", (d: NodeDatum) => x(d.x || 0)).attr("cy", (d) => y(d.y || 0));

  /******************** Lasso using d3.drag ********************/
  // From (https://stackoverflow.com/questions/64107576/lasso-plugin-wont-work-with-d3-upgrade-to-v6)
  // lasso selection based on the drag events
  let nodesRelative = nodes.map((d) => ({ ...d, x: x(d.x), y: y(d.y) }));
  let coords: Array<[number, number]> = [];
  const lineGenerator = d3.line();

  const pointInPolygon = function (
    point: [number, number],
    vs: Array<[number, number]>
  ) {
    // console.log(point, vs);
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    const x = point[0],
      y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0],
        yi = vs[i][1];
      const xj = vs[j][0],
        yj = vs[j][1];

      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  function drawPath() {
    d3.select("#lasso")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("fill", "#00000054")
      .attr("d", lineGenerator(coords));
  }

  function dragStart() {
    coords = [];
    node.attr("fill", (d: NodeDatum) => color(String(d.group)));
    d3.select("#lasso").remove();
    svg.append("path").attr("id", "lasso");
  }

  function dragMove(
    event: d3.D3DragEvent<SVGSVGElement, undefined, undefined>
  ) {
    const mouseX = event.sourceEvent.offsetX;
    const mouseY = event.sourceEvent.offsetY;
    coords.push([vb[0] + mouseX / 2, vb[1] + mouseY / 2]);
    drawPath();
  }

  function dragEnd() {
    const selectedDots: { [n: number]: boolean } = {};
    // node.each((d, i) => {
    //   const point = [x(d.x), y(d.y)];
    //   // console.log(point);
    //   if (pointInPolygon(point, coords)) {
    //     // d3.select("#dot-" + d.id).attr("fill", "red");
    //     selectedDots.push(d.id);
    //   }
    // });
    nodesRelative.forEach((d, i) => {
      const point = [d.x, d.y];
      // console.log(point);
      if (pointInPolygon(point as [number, number], coords)) {
        // d3.select("#dot-" + d.id).attr("fill", "red");
        selectedDots[d.id] = true;
      }
    });
    console.log(`select: ${Object.keys(selectedDots).map(Number)}`);
    Object.keys(selectedDots).length > 0 &&
      node.attr("fill", (d: NodeDatum) =>
        color(selectedDots[d.id] ? "1" : "0")
      );

    d3.select("#lasso").remove();
    selected = selectedDots;
  }

  const drag = d3
    .drag<SVGSVGElement, undefined, undefined>()
    .on("start", dragStart)
    .on("drag", dragMove)
    .on("end", dragEnd)
    .filter((e: DragEvent) => {
      return !e.ctrlKey && !e.shiftKey && !e.button;
    });
  svg.call(drag);

  /******************** Zoom ********************/
  // Put after lasso because otherwise lasso doesn't work

  function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    node
      .attr("cx", (d) => x(d.x) + event.transform.applyX(x(d.x)))
      .attr("cy", (d) => y(d.y) + event.transform.applyY(y(d.y)));
    nodesRelative = nodes.map((d) => ({
      ...d,
      x: x(d.x) + event.transform.applyX(x(d.x)),
      y: y(d.y) + event.transform.applyY(y(d.y)),
    }));

    link
      .attr("x1", (d) => x(d.source.x) + event.transform.applyX(x(d.source.x)))
      .attr("x2", (d) => x(d.target.x) + event.transform.applyX(x(d.target.x)))
      .attr("y1", (d) => y(d.source.y) + event.transform.applyY(y(d.source.y)))
      .attr("y2", (d) => y(d.target.y) + event.transform.applyY(y(d.target.y)));
  }
  const zoom = d3
    .zoom<SVGSVGElement, undefined>()
    .extent([
      [0, 0],
      [100, 100],
    ])
    .scaleExtent([1, 100])
    .filter((e) => {
      return ((e.ctrlKey || e.shiftKey) && !e.button) || e.type === "wheel";
    })
    .on("zoom", zoomed);
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  /******************** Draw svg ********************/
  console.log(svg.node());
  const svgRef = React.useRef(null);
  if (svgRef.current) {
    svgRef.current.replaceWith(svg.node());
  }

  // TODO: Add a reset button
  return (
    <Container>
      <Box
        sx={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg ref={svgRef} />
      </Box>
    </Container>
  );
}
