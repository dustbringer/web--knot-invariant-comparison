"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

import * as d3 from "d3";

import Container from "@/components/Container";
import Radio from "@/components/Radio";
import Link from "@/components/Link";
import createGraphSVG, { colors as nodeColors, rgbToText } from "./graph-svg";
import staticify from "@/util/staticURLs";

type NodeDatum = {
  id: number;
  size?: number;
  group: number;
} & d3.SimulationNodeDatum;
type LinkDatum = { value?: number } & d3.SimulationLinkDatum<NodeDatum>;

type SVGData = {
  container: d3.Selection<HTMLDivElement, undefined, null, undefined>;
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
  tooltip: d3.Selection<HTMLDivElement, undefined, null, undefined>;
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
  const [bmType, setBmType] = React.useState<string>("b1");
  const [bmLinks, setBmLinks] = React.useState<Array<LinkDatum>>([]);
  const [bmNodes, setBmNodes] = React.useState<Array<NodeDatum>>([]);
  const [bmPCBL, setBmPCBL] = React.useState<Array<Array<number>>>([]);
  const [bmMaxNodeSize, setBmMaxNodeSize] = React.useState<number>(0);
  const [bmLoaded, setBmLoaded] = React.useState<boolean>(false);
  const [lassoEnabled, setLassoEnabled] = React.useState<boolean>(false);
  const [svgRef, setSvgRef] = React.useState<HTMLDivElement | null>(null);
  const [svgData, setSvgData] = React.useState<SVGData>();
  const [selected, setSelected] = React.useState<{ [n: number]: boolean }>({});

  const [bmCmpType, setBmCmpType] = React.useState<string>("jones");
  const [bmCmpLinks, setBmCmpLinks] = React.useState<Array<LinkDatum>>([]);
  const [bmCmpNodes, setBmCmpNodes] = React.useState<Array<NodeDatum>>([]);
  const [bmCmpPCBL, setBmCmpPCBL] = React.useState<Array<Array<number>>>([]);
  const [bmCmpMaxNodeSize, setBmCmpMaxNodeSize] = React.useState<number>(0);
  const [bmCmpLoaded, setBmCmpLoaded] = React.useState<boolean>(false);
  const [svgCmpRef, setSvgCmpRef] = React.useState<HTMLDivElement | null>(null);
  const [svgCmpData, setSvgCmpData] = React.useState<SVGData>();

  React.useEffect(() => {
    setBmLoaded(false);
    Promise.all([
      fetch(staticify(`/static/bm/bm-${bmType}.edge.out`)),
      fetch(staticify(`/static/bm/bm-${bmType}.pcbl.out`)),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        console.log("input bm: got it");
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
        setSelected([]);

        console.log("input bm: done loading");
      });
  }, [bmType]);

  React.useEffect(() => {
    setBmCmpLoaded(false);
    Promise.all([
      fetch(staticify(`/static/bm/bm-${bmCmpType}.edge.out`)),
      fetch(staticify(`/static/bm/bm-${bmCmpType}.pcbl.out`)),
    ])
      .then((res) => Promise.all(res.map((r) => r.text())))
      .then((res) => {
        console.log("output bm: got it");
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

        console.log("output bm: done loading");
      });
  }, [bmCmpType]);

  React.useEffect(() => {
    if (bmNodes.length === 0) {
      // stops accidentally rendering nothing (after rendering the correct thing)
      return;
    }

    const { container, svg, node, link, drag, zoom, tooltip } = createGraphSVG({
      inputNodes: bmNodes,
      inputLinks: bmLinks,
      width: 800,
      height: 800,
      maxNodeSize: bmMaxNodeSize,
      setSelected,
    });
    setSvgData({ container, svg, node, link, drag, zoom, tooltip });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgRef?.replaceChildren(
      container.node() || "Ballmapper loaded with error..."
    );

    setBmLoaded(true);
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

    const { container, svg, node, link, drag, zoom, tooltip } = createGraphSVG({
      inputNodes: bmCmpNodes,
      inputLinks: bmCmpLinks,
      width: 800,
      height: 800,
      maxNodeSize: bmCmpMaxNodeSize,
      setSelected: () => {},
      disableLasso: true,
    });
    setSvgCmpData({ container, svg, node, link, drag, zoom, tooltip });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgCmpRef?.replaceChildren(
      container.node() || "Ballmapper loaded with error..."
    );

    setBmCmpLoaded(true);
  }, [svgCmpRef, bmCmpNodes, bmCmpLinks, bmCmpMaxNodeSize]);

  const transferSelected = () => {
    console.log(selected);
    const pcbl: { [index: number]: boolean } = {};
    Object.keys(selected).forEach((n) =>
      bmPCBL[Number(n) - 1].forEach((n) => {
        pcbl[n] = true;
      })
    );
    const sizes: { [index: number]: [number, number, number] } = {};
    bmCmpNodes.forEach(
      (d) =>
        (sizes[d.id] = [
          bmCmpPCBL[Number(d.id) - 1].filter((n) => pcbl[n]).length /
            (d.size || 1),
          bmCmpPCBL[Number(d.id) - 1].filter((n) => pcbl[n]).length,
          d.size || 1,
        ])
    );
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr("fill", (d) =>
        rgbToText(colorLerp(nodeColors[0], nodeColors[1], sizes[d.id][0]))
      );
    svgCmpData?.node.on("mouseover", (e: MouseEvent, d: NodeDatum) => {
      svgCmpData?.tooltip
        .html(
          `#${d.id}<br>size: ${sizes[d.id][1]}/${d.size} (${Math.round(
            (10000 * sizes[d.id][0]) / 100
          )}%)`
        )
        .style("visibility", "visible");
    });

    console.log(sizes);
  };

  // Features
  // TODO: Disable the compare button when one of them is being loaded
  // TODO: Don't refetch to reuse, save all the ones we loaded to a dictionary (add this as a toggle, because some people don't have much memory)
  // TODO: Change node size when zooming or resizing (it's too small on phone)

  // Bugs
  // TODO: Lasso broken when page is resized
  return (
    <Container>
      <div>
        <Typography variant="body1">
          Select invariants to compare their ballmappers. <i>Input</i> has
          selectable nodes, which is compared to <i>Output</i> by pressing the
          [Compare!] button.
        </Typography>
        <div
          style={{
            margin: "0 .5em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Radio
            title="Input"
            options={[
              { name: "A2", value: "a2" },
              { name: "Alexander", value: "alexander" },
              { name: "B1", value: "b1" },
              { name: "Jones", value: "jones" },
              { name: "Khovanov", value: "khovanov" },
              { name: "KhovanovT1", value: "khovanov-t1" },
            ]}
            value={bmType}
            onChange={(e) => setBmType((e.target as HTMLInputElement).value)}
          />
          <Radio
            title="Output"
            options={[
              { name: "A2", value: "a2" },
              { name: "Alexander", value: "alexander" },
              { name: "B1", value: "b1" },
              { name: "Jones", value: "jones" },
              { name: "Khovanov", value: "khovanov" },
              { name: "KhovanovT1", value: "khovanov-t1" },
            ]}
            value={bmCmpType}
            onChange={(e) => setBmCmpType((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      <Typography variant="body1">
        <i>Interactive</i> plot: zoom, pan, hover and select!
      </Typography>
      <ul style={{ margin: "0", marginBottom: "1em" }}>
        <li>Size of nodes (barely) indicates how many knots inside.</li>
        <li>
          Hover over nodes to see their indexing and coverage (for comparison
          ballmapper). Color of nodes indicate percentage of knots selected.
          Nodes are semi-transparent so their color is not completely accurate
          when overlapping. To see which knots live inside each node, see [
          <Link href="/static/bm/bm-a2.pcbl.out">A2</Link>,{" "}
          <Link href="/static/bm/bm-alexander.pcbl.out">Alexander</Link>,{" "}
          <Link href="/static/bm/bm-b1.pcbl.out">B1</Link>,{" "}
          <Link href="/static/bm/bm-jones.pcbl.out">Jones</Link>,{" "}
          <Link href="/static/bm/bm-khovanov.pcbl.out">Khovanov</Link>,{" "}
          <Link href="/static/bm/bm-khovanov-t1.pcbl.out">KhovanovT1</Link>].
        </li>
      </ul>

      <div>
        <Typography variant="body1">
          Toggle lasso selection on the first ballmapper. For your convenience,
          holding [Ctrl] or [Shift] keys will temporarily switch between pan and
          lasso mode.
        </Typography>
        <div>
          <Switch
            checked={lassoEnabled}
            onChange={(e) => setLassoEnabled(e.target.checked)}
          />
          Lasso
        </div>
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
        disableElevation
        disabled={!(bmLoaded && bmCmpLoaded)}
        sx={{ width: "100px", margin: "5px auto" }}
        onClick={transferSelected}
      >
        Compare!
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
