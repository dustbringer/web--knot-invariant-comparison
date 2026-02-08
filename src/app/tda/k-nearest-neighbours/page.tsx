"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Container from "@/components/Container";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";
import Radios from "@/components/Radios";

import staticify from "@/util/staticURLs";
import { Switch } from "@mui/material";
import Image from "next/image";

const options: {
  [name: string]: {
    display: string;
  };
} = {
  // ["a2-3-13"]: { display: "A2" },
  ["alexander-3-13"]: { display: "Alexander" },
  // ["b1-3-13"]: { display: "B1" },
  // ["bnvdv-3-13"]: { display: "BV" },
  // ["hfk2-3-13"]: { display: "HFK2" },
  // ["hfk2-t1-3-13"]: { display: "HFK2T1" },
  // ["homflypt-3-13"]: { display: "HOMFLYPT" },
  // ["homflypt-homology-3-11"]: { display: "HOMFLYPTHomology-3-11" },
  ["jones-3-13"]: { display: "Jones" },
  ["khovanov-3-13"]: { display: "Khovanov" },
  // ["khovanov-t1-3-13"]: { display: "KhovanovT1" },
  // ["khodd-3-13"]: { display: "KhovanovOdd" },
  // ["kr3-3-13"]: { display: "KR3" },
  // ["v1-3-13"]: { display: "V1" },
  // ["v2-3-13"]: { display: "V2" },
};

export default function KNNPage() {
  const [inv, setInv] = React.useState<string>("jones-3-13");
  const [onlyMutualEdges, setOnlyMutualEdges] = React.useState<boolean>(false);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        k-Nearest Neighbours
      </Typography>

      <Typography variant="body1">
        Select invariant for persistence graph.
      </Typography>
      <div
        style={{
          margin: "0.5em",
        }}
      >
        <Radios
          title="Invariant"
          options={Object.entries(options).map(([k, v]) => ({
            name: v.display,
            value: k,
          }))}
          value={inv}
          onChange={(e) => setInv((e.target as HTMLInputElement).value)}
        />
      </div>
      <Typography variant="body1" gutterBottom>
        <i>Interactive</i> plot: zoom, pan and toggle your desired invariants!
      </Typography>
      <div>
        <div>
          <Switch
            checked={onlyMutualEdges}
            onChange={(e) => setOnlyMutualEdges(e.target.checked)}
          />
          Only Mutual edges
        </div>
      </div>

      <div>
        {!onlyMutualEdges ? (
          <Image
            src={staticify(`/static/k-nearest-neighbours/knn-${inv}-pca10.gif`)}
            alt={`knn-${inv}-pca10.gif`}
            width={0}
            height={0}
            style={{ width: "100%", height: "auto" }} // optional
          />
        ) : (
          <Image
            src={staticify(
              `/static/k-nearest-neighbours/knn-${inv}-pca10.min.gif`,
            )}
            alt={`knn-${inv}-pca10.min.gif`}
            width={0}
            height={0}
            style={{ width: "100%", height: "auto" }} // optional
          />
        )}
      </div>
    </Container>
  );
}
