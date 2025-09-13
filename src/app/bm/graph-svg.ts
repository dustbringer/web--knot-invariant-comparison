import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

type NodeDatum = {
  id: number;
  size?: number;
  group: number;
} & d3.SimulationNodeDatum;
type LinkDatum = { value?: number } & d3.SimulationLinkDatum<NodeDatum>;

export const viewboxSetup = (h: number, w: number) => [-w / 2, -h / 2, w, h];

export const colors: Array<[number, number, number]> = [
  [1, 0.961, 0.941],
  [0.404, 0, 0.051],
];

export const rgbToText = ([r, g, b]: [number, number, number]) =>
  `rgb(${r * 255},${g * 255},${b * 255})`;

export default function createGraphSVG({
  inputNodes,
  inputLinks,
  width = 800,
  height = 800,
  maxNodeSize,
  setSelected,
  disableLasso = false,
}: {
  inputNodes: Array<NodeDatum>;
  inputLinks: Array<LinkDatum>;
  width: number;
  height: number;
  maxNodeSize: number;
  setSelected: (selected: { [n: number]: boolean }) => void;
  disableLasso?: boolean;
}) {
  const container = d3.create("div");

  const nodeStroke = 1;
  const nodeRadiusMax = 12;
  const nodeRadiusMin = 4;
  const lineStroke = 2.5;

  // These get overwritten, so create a copy
  const nodes = inputNodes.map((d) => ({ ...d }));
  const links = inputLinks.map((d) => ({ ...d }));
  // console.log(nodes, links);

  // // Specify the color scale.
  // const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Recale everything to be smaller
  const x = d3.scaleLinear().domain([0, width]).range([0, 100]);
  const y = d3
    .scaleLinear()
    .domain([0, height])
    .range([0, (100 * height) / width]);

  // // No rescale
  // const x = d3.scaleLinear().domain([0, width]).range([0, width]);
  // const y = d3.scaleLinear().domain([0, height]).range([0, height]);

  const vb = viewboxSetup(height, width);
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", vb)
    .attr(
      "style",
      "max-width: 100%; height: auto; border: 1px solid #333; display: block"
    );

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-500))
    .force(
      "link",
      d3
      .forceLink<NodeDatum, LinkDatum>(links)
      .id((d) => d.id)
      .distance(30)
      .strength(0.3)
      .iterations(40)
    )
    // Force toward the center
    .force("center", d3.forceCenter(width / 2, height / 2))
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
    // .attr("stroke-width", (d) => d.value)
    .attr("stroke-width", lineStroke);
  link
    .attr("x1", (d: LinkDatum) => x((d.source as NodeDatum).x || 0))
    .attr("x2", (d: LinkDatum) => x((d.target as NodeDatum).x || 0))
    .attr("y1", (d: LinkDatum) => y((d.source as NodeDatum).y || 0))
    .attr("y2", (d: LinkDatum) => y((d.target as NodeDatum).y || 0));

  const node = svg
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", nodeStroke)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("id", (d) => {
      return "dot-" + d.id;
    })
    .attr("fill-opacity", "80%")
    .attr(
      "r",
      (d: NodeDatum) =>
        (nodeRadiusMax * (d.size || 1)) / maxNodeSize + nodeRadiusMin
    )
    .attr("fill", (d: NodeDatum) => rgbToText(colors[0]));
  node.attr("cx", (d: NodeDatum) => x(d.x || 0)).attr("cy", (d) => y(d.y || 0));

  /******************** Lasso using d3.drag ********************/
  // From (https://stackoverflow.com/questions/64107576/lasso-plugin-wont-work-with-d3-upgrade-to-v6)
  // lasso selection based on the drag events
  let nodesRelative = nodes.map((d: NodeDatum) => ({
    ...d,
    x: x(d.x || 0),
    y: y(d.y || 0),
  }));
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
    // node.attr("fill", (d: NodeDatum) => rgbToText(colors[0]));
    d3.select("#lasso").remove();
    svg.append("path").attr("id", "lasso");
  }

  function dragMove(
    event: d3.D3DragEvent<SVGSVGElement, undefined, undefined>
  ) {
    const mouseX = event.sourceEvent.offsetX;
    const mouseY = event.sourceEvent.offsetY;
    coords.push([vb[0] + mouseX, vb[1] + mouseY]);
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
    node.attr("fill", (d: NodeDatum) =>
      selectedDots[d.id] ? rgbToText(colors[1]) : rgbToText(colors[0])
    );

    d3.select("#lasso").remove();
    setSelected(selectedDots);
  }

  const drag = d3
    .drag<SVGSVGElement, undefined, undefined>()
    .on("start", dragStart)
    .on("drag", dragMove)
    .on("end", dragEnd)
    .filter((e: DragEvent) => {
      if (disableLasso) {
        return false;
      } else {
        return (e.ctrlKey || e.shiftKey) && !e.button;
      }
    });

  // TODO: This doesn't work on mobile
  svg.call(drag);

  /******************** Zoom ********************/
  // Put after lasso because otherwise lasso doesn't work

  function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    node
      .attr("cx", (d: NodeDatum) => event.transform.applyX(x(d.x || 0)))
      .attr("cy", (d: NodeDatum) => event.transform.applyY(y(d.y || 0)))
      .attr(
        "r",
        (d: NodeDatum) =>
          Math.sqrt(event.transform.k * 0.25) *
          ((nodeRadiusMax * (d.size || 1)) / maxNodeSize + nodeRadiusMin)
      );
    nodesRelative = nodes.map((d: NodeDatum) => ({
      ...d,
      x: event.transform.applyX(x(d.x || 0)),
      y: event.transform.applyY(y(d.y || 0)),
    }));

    link
      .attr("x1", (d: LinkDatum) =>
        event.transform.applyX(x((d.source as NodeDatum).x || 0))
      )
      .attr("x2", (d: LinkDatum) =>
        event.transform.applyX(x((d.target as NodeDatum).x || 0))
      )
      .attr("y1", (d: LinkDatum) =>
        event.transform.applyY(y((d.source as NodeDatum).y || 0))
      )
      .attr("y2", (d: LinkDatum) =>
        event.transform.applyY(y((d.target as NodeDatum).y || 0))
      );
  }
  const zoom = d3
    .zoom<SVGSVGElement, undefined>()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([0.5, 500])
    .filter((e) => {
      return !e.button || e.type === "wheel";
    })
    .on("zoom", zoomed);
  svg.call(zoom.transform, d3.zoomIdentity.scale(3)).call(zoom); // set initial scale

  // Tooltip
  // (based off https://d3-graph-gallery.com/graph/interactivity_tooltip.html and https://observablehq.com/@clhenrick/tooltip-d3-convention)
  const tooltip = container
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseOver = (e: MouseEvent, d: NodeDatum) => {
    // console.log(e, d);
    tooltip.html(`#${d.id}<br>size: ${d.size}`).style("visibility", "visible");
  };
  const mouseMove = (e: MouseEvent, d: NodeDatum) => {
    tooltip
      .style("top", e.pageY + 30 + "px")
      .style("left", e.pageX + 30 + "px");
  };
  const mouseLeave = (e: MouseEvent, d: NodeDatum) => {
    tooltip.style("visibility", "hidden");
  };
  node
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);

  return { container, svg, node, link, drag, zoom, tooltip };
}
