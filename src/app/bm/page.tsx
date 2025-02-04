"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import * as d3 from "d3";

export default function BallmapperPage() {
  const [bmLinks, setBmLinks] = React.useState<
    Array<{ source: string; target: string; value?: number }>
  >([]);
  const [bmNodes, setBmNodes] = React.useState<
    Array<{
      id: string;
      group: number;
    }>
  >([]);
  React.useEffect(() => {
    fetch(`bm-jones.edge.out`)
      .then((res) => res.text())
      .then((res) => {
        console.log("got it");
        const lines = res
          .trim()
          .split("\n")
          .map((line) => line.split(" "));
        setBmNodes(
          [...new Set(lines.flat())].map((name) => ({
            id: name,
            group: 1,
          }))
        );
        setBmLinks(
          lines.map((edge) => ({ source: edge[0], target: edge[1], value: 2 }))
        );
        console.log("done loading");
      });
  }, []);

  // // Specify the dimensions of the chart.
  // const width = 928;
  // const height = 680;

  // // Specify the color scale.
  // const color = d3.scaleOrdinal(d3.schemeCategory10);

  // These get overwritten, so create a copy
  const nodes = bmNodes.map((d) => ({ ...d }));
  const links = bmLinks.map((d) => ({ ...d }));
  console.log(nodes, links);

  // // Create a simulation with several forces.
  // const simulation = d3
  //   .forceSimulation(nodes)
  //   .force(
  //     "link",
  //     d3.forceLink(links).id((d) => d.id)
  //   )
  //   .force("charge", d3.forceManyBody())
  //   .force("x", d3.forceX())
  //   .force("y", d3.forceY())
  //   .stop();

  // // Create the SVG container.
  // const svg = d3
  //   .create("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .attr("viewBox", [-width / 2, -height / 2, width, height])
  //   .attr("style", "max-width: 100%; height: auto;");

  // simulation.tick(1000);
  // // Add a line for each link, and a circle for each node.
  // const link = svg
  //   .append("g")
  //   .attr("stroke", "#999")
  //   .attr("stroke-opacity", 0.6)
  //   .selectAll("line")
  //   .data(links)
  //   .join("line")
  //   .attr("stroke-width", (d) => Math.sqrt(d.value));

  // const node = svg
  //   .append("g")
  //   .attr("stroke", "#fff")
  //   .attr("stroke-width", 1.5)
  //   .selectAll("circle")
  //   .data(nodes)
  //   .join("circle")
  //   .attr("r", 5)
  //   .attr("fill", (d) => color(d.group));

  // node.append("title").text((d) => d.id);

  // // Add a drag behavior.
  // node.call(
  //   d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  // );

  // // Set the position attributes of links and nodes each time the simulation ticks.
  // simulation.on("tick", () => {
  //   link
  //     .attr("x1", (d) => d.source.x)
  //     .attr("y1", (d) => d.source.y)
  //     .attr("x2", (d) => d.target.x)
  //     .attr("y2", (d) => d.target.y);

  //   node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  // });

  // // Reheat the simulation when drag starts, and fix the subject position.
  // function dragstarted(event) {
  //   if (!event.active) simulation.alphaTarget(0.3).restart();
  //   event.subject.fx = event.subject.x;
  //   event.subject.fy = event.subject.y;
  // }

  // // Update the subject (dragged node) position during drag.
  // function dragged(event) {
  //   event.subject.fx = event.x;
  //   event.subject.fy = event.y;
  // }

  // // Restore the target alpha so the simulation cools after dragging ends.
  // // Unfix the subject position now that it’s no longer being dragged.
  // function dragended(event) {
  //   if (!event.active) simulation.alphaTarget(0);
  //   event.subject.fx = null;
  //   event.subject.fy = null;
  // }

  const width = 800;
  const height = 800;
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-80))
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(20)
        .strength(0.8)
        .iterations(100)
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .stop();

  // Run the simulation to its end, then draw. default 300
  simulation.tick(10);

  svg
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 4.5);

  console.log(svg.node());
  const svgRef = React.useRef(null);
  if (svgRef.current) {
    svgRef.current.replaceWith(svg.node());
  }

  return (
    <div id="root">
      <svg ref={svgRef} />
    </div>
  );
}
