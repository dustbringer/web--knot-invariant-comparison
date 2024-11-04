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
import a2BM from "./data/a2-bm.json";
import khovanovBM from "./data/khovanov-bm.json";
import percentUnique from "./data/percent-unique.json";

const plotDataUnique = {
  name: "%Unique",
  json: percentUnique,
  docid: "abd3f26e-9d72-41e4-8bad-f731fa26442b",
};

const plotDataBM = [
  { name: "B1", json: b1BM, docid: "e0c58171-a6db-4c26-8813-988c17bd34f3" },
  {
    name: "Jones",
    json: jonesBM,
    docid: "9e45558c-8e20-4334-bc53-7a8f0885f5ab",
  },
  { name: "A2", json: a2BM, docid: "6c50fd12-1b29-4b21-b7e7-ec44c2f2c348" },
  {
    name: "Khovanov",
    json: khovanovBM,
    docid: "be8b6b79-aede-4004-a647-a99cbc5eb982",
  },
];

export default function Home() {
  const [plot, setPlot] = React.useState(0);

  const onChange = (e) => {
    setPlot(e.target.value);
  };

  React.useEffect(() => {
    // Clear nodes
    const ids = ["bokeh-plot-unique"];
    ids.forEach((id) => {
      document.getElementById(id)?.replaceChildren();
    });

    // Dynamically import to avoid "document doesn't exist" in prerender
    import("./bokeh/bokeh-widgets.esm.min.js")
      .then(() => import("./bokeh/bokeh.esm.min.js"))
      .then((res) => {
        const Bokeh = res.default;
        Bokeh.embed.embed_items(JSON.stringify(plotDataUnique.json), [
          {
            docid: plotDataUnique.docid,
            roots: { x: "bokeh-plot-unique" },
            root_ids: ["x"],
          },
        ]);
      });
  }, []);

  React.useEffect(() => {
    // source: bokeh html output
    // source for inspiration https://discourse.bokeh.org/t/bokehjs-frontend-library-react-recommended-approach/8919

    // const myNode = document.getElementById("bokeh_plot");
    // myNode.replaceChildren(); // clean previous plot

    // Clear nodes
    const ids = ["bokeh-plot-bm"];
    ids.forEach((id) => {
      document.getElementById(id)?.replaceChildren();
    });

    // Dynamically import to avoid "document doesn't exist" in prerender
    import("./bokeh/bokeh-widgets.esm.min.js")
      .then(() => import("./bokeh/bokeh.esm.min.js"))
      .then((res) => {
        const Bokeh = res.default;
        Bokeh.embed.embed_items(JSON.stringify(plotDataBM[plot].json), [
          {
            docid: plotDataBM[plot].docid,
            roots: { x: "bokeh-plot-bm" },
            root_ids: ["x"],
          },
        ]);
      });
  }, [plot]);

  return (
    <div id="root">
      <div className="section">
        <h1>Percentage of Unique Values</h1>
        <div className="bokeh-plot" id="bokeh-plot-unique" />
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
