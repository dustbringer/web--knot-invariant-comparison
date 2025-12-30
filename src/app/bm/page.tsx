"use client";

import * as React from "react";

// import Plot from "react-plotly.js";
// // Plotly nextjs ssr issue fix: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
// const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

import * as d3 from "d3";

import Container from "@/components/Container";
import Radio from "@/components/Radios";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";
import Checkboxes from "@/components/Checkboxes";
import HorizontalRule from "@/components/styled/HorizontalRule";
import Tooltip from "@/components/Tooltip";
import Range from "@/components/Range";
import createGraphSVG, { colors as nodeColors, rgbToText } from "./graph-svg";
import staticify from "@/util/staticURLs";
import { max, min, sum } from "@/util/array-util";
import { lerp, rgbLerp } from "@/util/number";

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

// color interpolator
const colorRainbow = (n: number) =>
  d3.scaleSequential(d3.interpolateTurbo)(lerp(0.075, 0.95, n));

const optionsBM: { [name: string]: string } = {
  ["a2"]: "A2",
  ["alexander"]: "Alexander",
  ["b1"]: "B1",
  ["bnvdv-3-15-e=0.15"]: "BV 3-15",
  ["hfk2"]: "HFK2",
  ["hfk2-t1"]: "HFK2T1",
  ["homflypt-e=0.5"]: "HOMFLYPT",
  // ["homflypt-e=0.75"]: "HOMFLYPT",
  // ["homflypt-e=1"]: "HOMFLYPT",
  // ["homflypt-3-13"]: "HOMFLYPT-small",
  // ["homflypt-partial-3-11-e=0.5"]: "HOMFLYPTHomology",
  ["homflypt-partial-3-11-e=1"]: "HOMFLYPTHomology 3-11",
  ["jones"]: "Jones",
  ["khovanov"]: "Khovanov",
  ["khovanov-t1"]: "KhovanovT1",
  ["khodd"]: "KhovanovOdd",
  ["kr3-3-15-e=0.5"]: "KR3 3-15",
  // ["kr3-3-15-e=1"]: "KR3",
};
const optionsVal: { [name: string]: string } = {
  ["hypvol"]: "hypvol",
  ["det"]: "det",
  ["det-primedivisors"]: "det-primedivisors",
  ["sig"]: "sig",
  ["sig-mod4"]: "sig-mod4",
  ["3genus-avg"]: "3genus",
  ["arf"]: "Arf",
  ["s-inv"]: "s-inv",
  ["s-inv-abs"]: "s-inv-abs",
};

const optionsType: { [name: string]: string } = {
  ["a"]: "alternating",
  ["n"]: "non-alternating",
  ["t"]: "torus",
  ["s"]: "satellite",
  ["h"]: "hyperbolic",
};

export default function BallmapperPage() {
  const bmSaved = React.useRef<{
    [inv: string]: { edge: string; pcbl: string };
  }>({});
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

  const [types, setTypes] = React.useState<Array<string> | null>(null);
  const [useSolidHighlight, setUseSolidHighlight] =
    React.useState<boolean>(false);
  const [checkedHighlight, setCheckedHighlight] = React.useState<{
    [s: string]: boolean;
  }>({});
  const [knotsText, setKnotsText] = React.useState<string>("");
  const [vals, setVals] = React.useState<{
    [name: string]: Array<number>;
  } | null>(null);
  const [valsInfo, setValsInfo] = React.useState<{
    [index: number]: number;
  }>({});
  const [sliderVal, setSliderVal] = React.useState<number>(0);

  const [curColorType, setCurColorType] = React.useState<string>("");
  const [curColorName, setCurColorName] = React.useState<string>("");

  React.useEffect(() => {
    setBmLoaded(false);
    Promise.resolve()
      .then(() => {
        if (bmSaved.current[bmType] === undefined) {
          console.log(`Fetching bm for ${bmType}`);
          return Promise.all([
            fetch(staticify(`/static/bm/bm-${bmType}.edge.out`)),
            fetch(staticify(`/static/bm/bm-${bmType}.pcbl.out`)),
          ])
            .then((res) => Promise.all(res.map((r) => r.text())))
            .then((res) => {
              bmSaved.current[bmType] = { edge: res[0], pcbl: res[1] };
              return { edge: res[0], pcbl: res[1] };
            });
        } else {
          return Promise.resolve(bmSaved.current[bmType]);
        }
      })
      .then((data: { edge: string; pcbl: string }) => {
        console.log(`Loading bm for ${bmType}`);
        const edges = data.edge
          .trim()
          .split("\n")
          .map((line) => line.split(" ").map((n) => Number(n) - 1));
        const pcbl = data.pcbl
          .trim()
          .split("\n")
          .map((line) => line.split(" ").map((n) => Number(n) - 1));
        const sizes = pcbl.map((line) => line.length);

        // Make sure to change index from 1-based to 0-based
        setBmPCBL(pcbl);
        setBmMaxNodeSize(max(sizes));
        setBmNodes(
          Array.from(Array(pcbl.length).keys()).map((i) => ({
            id: i,
            group: 0,
            size: sizes[i],
          }))
        );

        setBmLinks(
          edges.map((edge) => ({
            source: edge[0],
            target: edge[1],
            value: 1,
          }))
        );
        setSelected([]);
      });
  }, [bmType]);

  React.useEffect(() => {
    setBmCmpLoaded(false);
    Promise.resolve()
      .then(() => {
        if (bmSaved.current[bmCmpType] === undefined) {
          console.log(`Fetching bmCmp for ${bmCmpType}`);
          return Promise.all([
            fetch(staticify(`/static/bm/bm-${bmCmpType}.edge.out`)),
            fetch(staticify(`/static/bm/bm-${bmCmpType}.pcbl.out`)),
          ])
            .then((res) => Promise.all(res.map((r) => r.text())))
            .then((res) => {
              bmSaved.current[bmCmpType] = { edge: res[0], pcbl: res[1] };
              return { edge: res[0], pcbl: res[1] };
            });
        } else {
          return Promise.resolve(bmSaved.current[bmCmpType]);
        }
      })
      .then((data: { edge: string; pcbl: string }) => {
        console.log(`Loading bmCmp for ${bmCmpType}`);
        const edges = data.edge
          .trim()
          .split("\n")
          .map((line) => line.split(" ").map((n) => Number(n) - 1));
        const pcbl = data.pcbl
          .trim()
          .split("\n")
          .map((line) => line.split(" ").map((n) => Number(n) - 1));
        const sizes = pcbl.map((line) => line.length);

        // Make sure to change index from 1-based to 0-based
        setBmCmpPCBL(pcbl);
        setBmCmpMaxNodeSize(Math.max(...sizes));
        setBmCmpNodes(
          Array.from(Array(pcbl.length).keys()).map((i) => ({
            id: i,
            group: 0,
            size: sizes[i],
          }))
        );

        setBmCmpLinks(
          edges.map((edge) => ({
            source: edge[0],
            target: edge[1],
            value: 1,
          }))
        );
      });
    setCurColorType("");
    setCurColorName("");
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
      ...{
        _forceSettings:
          bmType !== "homflypt-e=0.5"
            ? {}
            : {
                charge: -100,
                // gravity: 0.8,
                linkDistance: 80,
                linkStrength: 0.2,
                linkIterations: 50,
                ticks: 20,
              },
      },
    });
    setSvgData({ container, svg, node, link, drag, zoom, tooltip });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgRef?.replaceChildren(
      container.node() || "Ballmapper loaded with error..."
    );

    setBmLoaded(true);
  }, [svgRef, bmType, bmNodes, bmLinks, bmMaxNodeSize]);

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
      ...{
        _forceSettings:
          bmCmpType !== "homflypt-e=0.5"
            ? {}
            : {
                charge: -100,
                // gravity: 0.8,
                linkDistance: 80,
                linkStrength: 0.2,
                linkIterations: 50,
                ticks: 20,
              },
      },
    });
    setSvgCmpData({ container, svg, node, link, drag, zoom, tooltip });

    /******************** Draw svg ********************/
    // console.log(svg.node());
    svgCmpRef?.replaceChildren(
      container.node() || "Ballmapper loaded with error..."
    );

    setBmCmpLoaded(true);
  }, [svgCmpRef, bmCmpType, bmCmpNodes, bmCmpLinks, bmCmpMaxNodeSize]);

  const transferSelected = () => {
    console.log(selected); // keys = id from bmNodes and bmCmpNodes
    const pcbl: { [index: number]: boolean } = {};
    Object.keys(selected).forEach((n) =>
      bmPCBL[Number(n)].forEach((n) => {
        pcbl[n] = true;
      })
    );
    const sizes: { [index: number]: [number, number, number] } = {};
    bmCmpNodes.forEach(
      (d) =>
        (sizes[d.id] = [
          bmCmpPCBL[Number(d.id)].filter((n) => pcbl[n]).length / (d.size || 1),
          bmCmpPCBL[Number(d.id)].filter((n) => pcbl[n]).length,
          d.size || 1,
        ])
    );
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr(
        "fill",
        (d) =>
          colorRainbow(
            useSolidHighlight ? (sizes[d.id][0] > 0 ? 1 : 0) : sizes[d.id][0]
          )
        // rgbToText(
        //   colorLerp(
        //     nodeColors[0],
        //     nodeColors[1],
        //     useSolidHighlight ? (sizes[d.id][0] > 0 ? 1 : 0) : sizes[d.id][0]
        //   )
        // )
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
    setCurColorType("compare");
    setCurColorName(`${optionsBM[bmType] ?? "Unknown"}`);
  };

  const highlightBool = async (ps: Array<number>, name: string) => {
    const pcbl: { [index: number]: boolean } = {};
    ps.forEach((n) => (pcbl[n] = true));

    const nodeInfo: { [index: number]: [number, number, number] } = {}; // [fraction selected, no. selected, no. in node]
    bmCmpNodes.forEach((d) => {
      nodeInfo[d.id] = [
        bmCmpPCBL[Number(d.id)].filter((n) => pcbl[n]).length / (d.size || 1),
        bmCmpPCBL[Number(d.id)].filter((n) => pcbl[n]).length,
        d.size || 1,
      ];
    });

    // // Highglight things
    // svgData?.node
    //   // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
    //   .attr("fill", (d) =>
    //     rgbToText(
    //       colorLerp(nodeColors[0], nodeColors[1], sizes[d.id][0] > 0 ? 1 : 0)
    //     )
    //   );
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr(
        "fill",
        (d) =>
          colorRainbow(
            useSolidHighlight
              ? nodeInfo[d.id][0] > 0
                ? 1
                : 0
              : nodeInfo[d.id][0]
          )
        // rgbToText(
        //   colorLerp(
        //     nodeColors[0],
        //     nodeColors[1],
        //     useSolidHighlight
        //       ? nodeInfo[d.id][0] > 0
        //         ? 1
        //         : 0
        //       : nodeInfo[d.id][0]
        //   )
        // )
      );

    // Mouseover
    svgCmpData?.node.on("mouseover", (e: MouseEvent, d: NodeDatum) => {
      svgCmpData?.tooltip
        .html(
          `#${d.id}<br>size: ${nodeInfo[d.id][1]}/${d.size} (${Math.round(
            (10000 * nodeInfo[d.id][0]) / 100
          )}%)`
        )
        .style("visibility", "visible");
    });

    // console.log(nodeInfo);

    setCurColorType("bool");
    setCurColorName(`${name}`);
  };

  const highlightVals = async (
    ps: Array<[number, number]>,
    name: string,
    preTransform: (val: number) => number = (n) => n,
    postTransform: (val: number) => number = (n) => n,
    defaultVal: number = 0
  ) => {
    // ps has [knot index, value]
    const pcbl: { [index: number]: number } = {};
    const pcblOriginal: { [index: number]: number } = {};
    ps.forEach(([n, v]) => {
      pcbl[n] = preTransform(v);
      pcblOriginal[n] = v;
    });

    const nodeInfo: { [index: number]: [number, number, number] } = {}; // [avg scaled val, sum vals, no. in node]
    const avgs: { [index: number]: number } = {}; // avg val
    const trDefaultVal = preTransform(defaultVal);
    bmCmpNodes.forEach((d) => {
      nodeInfo[d.id] = [
        postTransform(
          sum(
            bmCmpPCBL[Number(d.id)].map((n) =>
              pcbl[n] !== undefined ? pcbl[n] : trDefaultVal
            )
          ) / (d.size || 1)
        ),
        sum(
          bmCmpPCBL[Number(d.id)].map((n) =>
            pcbl[n] !== undefined ? pcbl[n] : trDefaultVal
          )
        ),
        d.size || 1,
      ];

      avgs[d.id] =
        sum(
          bmCmpPCBL[Number(d.id)].map((n) =>
            pcblOriginal[n] !== undefined ? pcblOriginal[n] : defaultVal
          )
        ) / (d.size || 1);
    });
    const maxavg = max(Object.values(nodeInfo).map((arr) => arr[0]));
    const minavg = min(Object.values(nodeInfo).map((arr) => arr[0]));

    // // Highglight things
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr("fill", (d) =>
        colorRainbow(
          lerp(0.1, 0.95, (nodeInfo[d.id][0] - minavg) / (maxavg - minavg))
        )
      );

    // Mouseover
    svgCmpData?.node.on("mouseover", (e: MouseEvent, d: NodeDatum) => {
      svgCmpData?.tooltip
        .html(
          `#${d.id}
          <br>size: ${d.size}
          <br>avg: ${avgs[d.id]} (${Math.round(
            (10000 * (nodeInfo[d.id][0] - minavg)) / (maxavg - minavg) / 100
          )}%)`
          // Actual colour output, for testing
          // `#${d.id}<br>${nodeInfo[d.id][0]} (${Math.round(
          //   (10000 * (nodeInfo[d.id][0] - minavg)) / (maxavg - minavg) / 100
          // )}%)`
        )
        .style("visibility", "visible");
    });

    // console.log(nodeInfo);
    setValsInfo(
      Object.fromEntries(
        Object.entries(nodeInfo).map((data) => [
          data[0],
          (data[1][0] - minavg) / (maxavg - minavg),
        ])
      )
    );

    setCurColorType("scalar");
    setCurColorName(`${name}`);
  };

  const highlightValsSlider = async (
    limit: number // number between 0 and 1
  ) => {
    setSliderVal(limit);

    const nodeInfo = valsInfo;
    // // Highlight things
    svgCmpData?.node
      // .attr("opacity", (d) => `${lerp(0.8, 1, sizes[d.id]) * 100}%`)
      .attr("fill", (d) =>
        colorRainbow(nodeInfo[d.id] * 100 <= limit ? 0.1 : 0.95)
      );
  };

  const highlightBoolType = async () => {
    let newTypes: Array<string> = types || [];
    if (types === null) {
      // Fill types if it is empty
      newTypes = (
        await fetch(staticify(`/static/bm/types-3-16.out`)).then((res) =>
          res.text()
        )
      )
        .trim()
        .split("\n");
      setTypes(newTypes);
    }

    const checked = ["a", "n", "t", "s", "h"].filter(
      (c) => checkedHighlight[c]
    );
    const output: Array<number> = [];
    newTypes?.forEach((t, i) => {
      if (checked.every((c) => t.includes(c))) {
        output.push(i);
      }
    });
    highlightBool(output, checked.map((s) => optionsType[s]).join(" AND "));
  };

  const highlightBoolSpecific = async () => {
    const idxs = knotsText
      .split(",")
      .filter((s) => s.trim() !== "")
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));
    highlightBool(idxs, `custom selected size=${idxs.length}`);
  };

  const highlightValsInv = async (name: string) => {
    if (
      Object.keys(optionsVal).filter((_name) => name === _name).length === 0
    ) {
      return;
    }

    const tanhPower = (times: number) => (n: number) => {
      let out = n;
      for (let i = 0; i < times; i++) {
        out = Math.tanh(out);
      }
      return out;
    };

    const newVals: { [name: string]: Array<number> } = vals || {};
    if (vals === null || vals[name] === undefined) {
      // Fill types if it is empty
      newVals[name] = (
        await fetch(staticify(`/static/bm/${name}-3-16.out`)).then((res) =>
          res.text()
        )
      )
        .trim()
        .split("\n")
        .map((line) => Number(line));
      setVals(newVals);
    }

    let preTransform = (n: number) => n;
    let postTransform = (n: number) => n;
    if (["det-primedivisors"].includes(name)) {
      preTransform = (n) => Math.pow(tanhPower(7)(n), 1);
      // preTransform = tanhPower(7);
    } else if (["arf"].includes(name)) {
      // preTransform = (n) => (n*2 - 1);
      postTransform = (n) => tanhPower(10)(n * 2 - 1);
    }

    highlightVals(
      newVals[name].map((v, i) => [i, v]),
      `${optionsVal[name]}`,
      preTransform,
      postTransform
    );
  };

  // Features
  // TODO: Change node size when zooming or resizing (it's too small on phone)

  // Bugs
  // TODO: Lasso broken when page is resized
  return (
    <Container>
      <div>
        <Typography variant="body1" gutterBottom>
          Variants:{" "}
          <Link href="/bm" inPlace sx={{ color: "secondary.main" }}>
            (all)
          </Link>{" "}
          <Link href="/bm/a" inPlace>
            (alternating)
          </Link>{" "}
          <Link href="/bm/n" inPlace>
            (non-alternating)
          </Link>
        </Typography>
      </div>
      <div>
        <Typography variant="body1">
          Select invariant for output ballmapper.
        </Typography>
        <div
          style={{
            margin: "0.5em",
          }}
        >
          <Radio
            title="Output"
            options={Object.entries(optionsBM).map(([k, v]) => ({
              name: v,
              value: k,
            }))}
            value={bmCmpType}
            onChange={(e) => setBmCmpType((e.target as HTMLInputElement).value)}
          />
        </div>
        <Typography variant="body1">
          <em>Note:</em>
        </Typography>
        <ul style={{ margin: "0", marginBottom: "1em" }}>
          <li>
            Everything is for knots up to 16 crossings; except HOMFLYPTHomology
            (3-11 crossings) and KR3 (3-15) crossings.
          </li>
          <li>
            Everything is normalised with ballmapper <TeX>\epsilon = 0.5</TeX>;
            except for A2 and HOMFLYPTHomology with <TeX>\epsilon = 1</TeX>.
          </li>
          <li>
            HOMFLYPTHomology was calculated over knots in a different order, so
            do not expect comparisons or highlighting to be correct.
          </li>
        </ul>
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
          {Object.entries(optionsBM).map((option, i) => (
            <React.Fragment key={`frag ${option[0]}`}>
              <Link
                href={`/static/bm/bm-${option[0]}.pcbl.out`}
                key={option[0]}
              >
                {option[1]}
              </Link>
              {i !== Object.keys(optionsBM).length - 1 && ", "}
            </React.Fragment>
          ))}
          ].
        </li>
      </ul>
      <Box sx={{ marginBottom: "10px", overflow: "hidden" }}>
        <Accordion title="Compare Invariants">
          <Typography variant="body1">
            Select invariant for comparison ballmapper. Select the nodes, and
            press the [Compare!] button to see on the <i>Output</i> ballmapper.
          </Typography>
          <Box
            style={{
              margin: "0.5em",
            }}
          >
            <Radio
              title="Input"
              options={Object.entries(optionsBM).map(([k, v]) => ({
                name: v,
                value: k,
              }))}
              value={bmType}
              onChange={(e) => setBmType((e.target as HTMLInputElement).value)}
            />
          </Box>

          <Box
            sx={{
              // border: "1px solid black",
              display: "flex",
              justifyContent: "center",
              margin: "0.75em 0",
            }}
          >
            <div ref={(node) => setSvgRef(node)} />
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <Box sx={{ margin: "0 20px" }}>
                Pan
                <Switch
                  checked={lassoEnabled}
                  onChange={(e) => setLassoEnabled(e.target.checked)}
                />
                Lasso
                <Tooltip
                  title={
                    <>
                      Toggle between Pan and Lasso.
                      <br />
                      Hold [Ctrl] or [Shift] to temporarily swap.
                    </>
                  }
                >
                  <IconButton
                    size="small"
                    disableFocusRipple
                    disableRipple
                    // disableTouchRipple
                    sx={{ margin: "0 7px" }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box>
                <Switch
                  checked={useSolidHighlight}
                  onChange={(e) => setUseSolidHighlight(e.target.checked)}
                />
                Solid Highlighting
                <Tooltip
                  title={<>Binary highlighting of empty and non-empty nodes.</>}
                >
                  <IconButton
                    size="small"
                    disableFocusRipple
                    disableRipple
                    // disableTouchRipple
                    sx={{ margin: "0 7px" }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                disableElevation
                disabled={!(bmLoaded && bmCmpLoaded)}
                sx={{ width: "100px" }}
                onClick={transferSelected}
              >
                Compare!
              </Button>
            </Box>
          </Box>
        </Accordion>

        <Accordion title="Colours">
          <Typography variant="body1">Types of knots</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkboxes
              options={[
                {
                  name: "alternating",
                  value: "a",
                },
                {
                  name: "non-alternating",
                  value: "n",
                },
                {
                  name: "torus",
                  value: "t",
                },
                {
                  name: "satellite",
                  value: "s",
                },
                {
                  name: "hyperbolic",
                  value: "h",
                },
              ]}
              checked={checkedHighlight}
              onChange={(name, e) =>
                setCheckedHighlight(
                  (obj) =>
                    ({
                      ...obj,
                      [name]: (e.target as HTMLInputElement).checked,
                    } as { [name: string]: boolean })
                )
              }
            />
            <Button
              variant="contained"
              size="small"
              onClick={highlightBoolType}
              disableElevation
            >
              Intersect
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              label="Specific Knots"
              variant="outlined"
              size="small"
              value={knotsText}
              onChange={(e) => {
                setKnotsText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  highlightBoolSpecific();
                }
              }}
            />
            <Button
              sx={{ margin: "0 5px" }}
              variant="contained"
              size="small"
              onClick={highlightBoolSpecific}
              disableElevation
            >
              Highlight
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Switch
              checked={useSolidHighlight}
              onChange={(e) => setUseSolidHighlight(e.target.checked)}
            />
            Solid Highlighting
            <Tooltip
              title={<>Binary highlighting of empty and non-empty nodes.</>}
            >
              <IconButton
                size="small"
                disableFocusRipple
                disableRipple
                // disableTouchRipple
                sx={{ margin: "0 7px" }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <HorizontalRule />

          <Typography variant="body1">Scalar invariants</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Object.entries(optionsVal).map(([name, display]) => (
              <Button
                key={name}
                sx={{ margin: "0 5px" }}
                variant={
                  curColorType === "scalar" && curColorName === display
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => highlightValsInv(name)}
                disableElevation
              >
                {display}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              margin: "5px 20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "start",
            }}
          >
            <Range
              // props={{ sx: { width: "100px" } }}
              disabled={curColorType !== "scalar"}
              min={0}
              max={100}
              value={sliderVal}
              step={1}
              onChange={(e) =>
                highlightValsSlider(
                  Number((e.target as HTMLInputElement)?.value || 0)
                )
              }
            />
            <Tooltip
              title={<>Binary highlighting separated by value in slider.</>}
            >
              <IconButton
                size="small"
                disableFocusRipple
                disableRipple
                // disableTouchRipple
                sx={{ margin: "0 0 0 1em" }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Accordion>

        <Accordion title="Epsilon movie">
          Jones:{" "}
          <Link href={`/static/bm/movie/jones-grow.gif`} inPlace>
            growing
          </Link>
          ,{" "}
          <Link href={`/static/bm/movie/jones-shrink.gif`} inPlace>
            shrinking
          </Link>
        </Accordion>
      </Box>

      <Typography variant="body1" sx={{ margin: "0 auto" }}>
        {curColorType !== "" &&
          `Current colours: (${curColorType}) ${curColorName}`}
      </Typography>
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
