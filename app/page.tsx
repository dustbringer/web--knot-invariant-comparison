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

const plotData = [
  { name: "B1", json: b1BM, docid: "209bedb5-2aeb-4930-8b5c-ae374deb2e77" },
  {
    name: "Jones",
    json: jonesBM,
    docid: "14530388-f676-443a-a4a4-ab1d9e075729",
  },
  { name: "A2", json: a2BM, docid: "96e72035-61c4-4406-9f4d-392df0ee6b29" },
  {
    name: "Khovanov",
    json: khovanovBM,
    docid: "dc9da31c-22ad-42b5-b216-66e1fcc0c8d0",
  },
];

export default function Home() {
  const [plot, setPlot] = React.useState(0);

  const onChange = (e) => {
    setPlot(e.target.value);
  };

  React.useEffect(() => {
    // source: bokeh html output
    // source for inspiration https://discourse.bokeh.org/t/bokehjs-frontend-library-react-recommended-approach/8919

    // const myNode = document.getElementById("bokeh_plot");
    // myNode.replaceChildren(); // clean previous plot

    // Dynamically import to avoid "document doesn't exist" in prerender
    import("./bokeh/bokeh-widgets.esm.min.js")
      .then(() => import("./bokeh/bokeh.esm.min.js"))
      .then((res) => {
        const myNode = document.getElementById("bokeh_plot");
        myNode?.replaceChildren(); // clean previous plot

        const Bokeh = res.default;
        Bokeh.embed.embed_items(JSON.stringify(plotData[plot].json), [
          {
            docid: plotData[plot].docid,
            roots: { x: "bokeh_plot" },
            root_ids: ["x"],
          },
        ]);
      });
  }, [plot]);
  return (
    <div id="root">
      <h1>Ballmapper Comparison</h1>
      <Form.Select onChange={onChange} value={plot} style={{margin: "5px auto", width: "200px"}}>
        {plotData.map(({ name }, i) => (
          <option value={i} key={name}>
            {name}
          </option>
        ))}
      </Form.Select>
      <div>
        <div id="bokeh_plot"></div>
      </div>
    </div>
  );
}
