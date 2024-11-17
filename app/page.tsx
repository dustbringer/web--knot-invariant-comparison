"use client";

import * as React from "react";

// import Bokeh from "./bokeh/bokeh.esm.min.js";
// import "./bokeh/bokeh-widgets.esm.min.js";
// import "./bokeh/bokeh-api.esm.min.js";
// import "./bokeh/bokeh-gl.esm.min.js";
// import "./bokeh/bokeh-mathjax.esm.min.js";
// import "./bokeh/bokeh-tables.esm.min.js";

import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

import b1BM from "./data/b1-bm.json";
import jonesBM from "./data/jones-bm.json";
import alexanderBM from "./data/alexander-bm.json";
import a2BM from "./data/a2-bm.json";
import khovanovBM from "./data/khovanov-bm.json";
import percentUnique from "./data/percent-unique.json";
import randomPairs from "./data/random-pairs.json";

const plotDataUnique = {
  name: "%Unique",
  json: percentUnique,
  docid: "895e431f-76bb-4570-a80d-84da99ffc602",
};

const plotDataRandomPairs = {
  name: "Random Pairs",
  json: randomPairs,
  docid: "471649ef-a1a4-4b1f-bb30-88fd11743460",
};

const plotDataBM = [
  { name: "B1", json: b1BM, docid: "c0f60360-eb61-4cb5-bf8b-56f88f27cc63" },
  {
    name: "Jones",
    json: jonesBM,
    docid: "e6193f97-3905-4290-9119-29183ef0661b",
  },
  { name: "Alexander", json: alexanderBM, docid: "045e0e17-94bb-4bd7-a469-50dcb11d2538" },
  { name: "A2", json: a2BM, docid: "b0b0ef32-8ea4-4890-946d-c8069f08d43a" },
  {
    name: "Khovanov",
    json: khovanovBM,
    docid: "52052191-a21f-4ea6-ba25-101520a057a2",
  },
];

export default function Home() {
  const [plot, setPlot] = React.useState(0);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlot(+e.target.value);
  };

  const showPlot = (
    data: { json: object; docid: string },
    className: string
  ) => {
    // source: bokeh html output
    // source for inspiration https://discourse.bokeh.org/t/bokehjs-frontend-library-react-recommended-approach/8919

    // const myNode = document.getElementById("bokeh_plot");
    // myNode.replaceChildren(); // clean previous plot

    document.getElementById(className)?.replaceChildren();

    // Dynamically import to avoid "document doesn't exist" in prerender
    import("./bokeh/bokeh-widgets.esm.min.js")
      .then(() => import("./bokeh/bokeh.esm.min.js"))
      .then((res) => {
        const Bokeh = res.default;
        Bokeh.embed.embed_items(JSON.stringify(data.json), [
          {
            docid: data.docid,
            roots: { x: className },
            root_ids: ["x"],
          },
        ]);
      });
  };

  React.useEffect(() => {
    const data = plotDataUnique;
    const className = "bokeh-plot-unique";
    showPlot(data, className);
  }, []);

  React.useEffect(() => {
    const data = plotDataRandomPairs;
    const className = "bokeh-plot-random-pairs";
    showPlot(data, className);
  }, []);

  React.useEffect(() => {
    const data = plotDataBM[plot];
    const className = "bokeh-plot-bm";
    showPlot(data, className);
  }, [plot]);

  return (
    <div id="root">
      <div className="section">
        <h1>Percentage of Unique Values</h1>
        <div className="bokeh-plot" id="bokeh-plot-unique" />
      </div>

      <div className="section">
        <h1>Comparisons of Random Pairs until equal</h1>
        <div className="bokeh-plot" id="bokeh-plot-random-pairs" />
      </div>

      <div className="section">
        <h1>Ballmapper Comparison</h1>
        <Form.Select
          onChange={onChange}
          value={plot}
          style={{ width: "500px" }}
        >
          {plotDataBM.map(({ name }, i) => (
            <option value={i} key={name}>
              {name}
            </option>
          ))}
        </Form.Select>
        <div className="bokeh-plot" id="bokeh-plot-bm" />
      </div>
    </div>
  );
}
