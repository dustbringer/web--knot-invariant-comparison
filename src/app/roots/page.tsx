"use client";

import * as React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import RootsPlot from "@/components/Roots";

export default function RootsPage() {
  const [roots, setRoots] = React.useState<Array<[number, number]>>([]);

  React.useEffect(() => {
    Promise.all([
      fetch("knot-alexander-3-16-roots.out").then((res) => res.text()),
    ]).then((res) => {
      console.log("Roots started processing");
      const roots = res.map(
        (r) =>
          r.split("\n").map((xy) => xy.split(",").map(Number)) as Array<
            [number, number]
          >
      );
      console.log(roots.length);
      const roots2 = roots.flat();
      setRoots(roots2);
      console.log("Roots finished processing");
    });
  }, []);

  return (
    <div id="root">
      <RootsPlot roots={roots} width={1000} height={1000} />
    </div>
  );
}
