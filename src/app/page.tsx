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
// import Button from "react-bootstrap/Button";

type plotData = {
  name: string;
  url: string;
  json: string | undefined;
  docid: string;
};

const plotDataUnique: plotData = {
  name: "%Unique",
  url: "data/15/percent-unique.json",
  json: undefined,
  docid: "b78ca7dc-1b9d-4062-818b-ab8946368686",
};

const plotDataRandomPairs: plotData = {
  name: "Random Pairs",
  url: "data/15/random-pairs.json",
  json: undefined,
  docid: "1e57dd74-3891-4521-8964-dfffa27de701",
};

const plotDataBMName = ["B1", "Jones", "Alexander", "A2", "Khovanov"];

const plotDataBM: Array<plotData> = [
  {
    name: "B1",
    url: "data/15/b1-bm.json",
    json: undefined,
    docid: "b1478073-e36f-46df-bce6-9ecf8cfa6fb4",
  },
  {
    name: "Jones",
    url: "data/15/jones-bm.json",
    json: undefined,
    docid: "84ad99c8-07a4-4586-9f60-8c172d23033a",
  },
  {
    name: "Alexander",
    url: "data/15/alexander-bm.json",
    json: undefined,
    docid: "8669e811-ff71-43fc-b1b8-454c3f4d815a",
  },
  {
    name: "A2",
    url: "data/15/a2-bm.json",
    json: undefined,
    docid: "c534f534-7182-4d6a-911e-ee84ebf04745",
  },
  {
    name: "Khovanov",
    url: "data/15/khovanov-bm.json",
    json: undefined,
    docid: "ad961e52-0300-4978-87fb-cc79ff9170b6",
  },
];

export default function Home() {
  const [plot, setPlot] = React.useState(0);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlot(+e.target.value);
  };

  const showPlot = (
    data: { json: string | undefined; docid: string },
    className: string
  ) => {
    // source: bokeh html output
    // source for inspiration https://discourse.bokeh.org/t/bokehjs-frontend-library-react-recommended-approach/8919

    // const myNode = document.getElementById("bokeh_plot");
    // myNode.replaceChildren(); // clean previous plot

    document.getElementById(className)?.replaceChildren();

    // Dynamically import to avoid "document doesn't exist" in prerender
    if (data.json !== undefined) {
      import("../bokeh/bokeh-widgets.esm.min.js")
        .then(() => import("../bokeh/bokeh.esm.min.js"))
        .then((res) => {
          const Bokeh = res.default;
          Bokeh.embed.embed_items(data.json, [
            {
              docid: data.docid,
              roots: { x: className },
              root_ids: ["x"],
            },
          ]);
        });
    }
  };

  React.useEffect(() => {
    const data = plotDataUnique;
    const pms =
      data.json === undefined
        ? fetch(data.url)
            .then((res) => res.text())
            .then((res) => {
              console.log(`Loaded ${data.url}`);
              data.json = res;
            })
        : Promise.resolve();
    pms.then(() => {
      const className = "bokeh-plot-unique";
      showPlot(data, className);
    });
  }, []);

  React.useEffect(() => {
    const data = plotDataRandomPairs;
    const pms =
      data.json === undefined
        ? fetch(data.url)
            .then((res) => res.text())
            .then((res) => {
              console.log(`Loaded ${data.url}`);
              data.json = res;
            })
        : Promise.resolve();
    pms.then(() => {
      const className = "bokeh-plot-random-pairs";
      showPlot(data, className);
    });
  }, []);

  React.useEffect(() => {
    const data = plotDataBM[plot];
    const pms =
      data.json === undefined
        ? fetch(data.url)
            .then((res) => res.text())
            .then((res) => {
              console.log(`Loaded ${data.url}`);
              data.json = res;
            })
        : Promise.resolve();

    pms.then(() => {
      const className = "bokeh-plot-bm";
      showPlot(data, className);
    });
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
        <span>
          Note: Some selections of the ballmapper exceeds the maximum call stack
          size of Chromium based browsers. Use e.g. Firefox for this to work.
        </span>
        <Form.Select
          onChange={onChange}
          value={plot}
          style={{ width: "500px" }}
        >
          {plotDataBMName.map((name, i) => (
            <option value={i} key={name}>
              {name}
            </option>
          ))}
        </Form.Select>
        <div className="bokeh-plot" id="bokeh-plot-bm"></div>
        <div>
          <h4>(Static links)</h4>
          <p>
            <a className="link" href="compare-b1.html">
              B1
            </a>
          </p>
          <p>
            <a className="link" href="compare-jones.html">
              Jones
            </a>
          </p>
          <p>
            <a className="link" href="compare-alexander.html">
              Alexander
            </a>
          </p>
          <p>
            <a className="link" href="compare-a2.html">
              A2
            </a>
          </p>
          <p>
            <a className="link" href="compare-khovanov.html">
              Khovanov
            </a>
          </p>
        </div>
        <div>
          <h3>(Old)</h3>
          <a className="link" href="14">
            Up to 14 crossings
          </a>
        </div>
      </div>
    </div>
  );
}
