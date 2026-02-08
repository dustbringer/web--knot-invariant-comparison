"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Container from "@/components/Container";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";

import websiteMap, { type Link as LinkT } from "@/data/websiteMap";

function generateLinks(ls: LinkT[]) {
  return (
    <>
      {ls.map((l, i) => (
        <li key={`li-${i}`}>
          {l.path !== undefined ? (
            <Link href={l.path} inPlace={l.path.startsWith("/")}>
              {l.name}
            </Link>
          ) : (
            l.name
          )}
          {l.sub !== undefined && l.sub.length > 0 && (
            <ul>{generateLinks(l.sub)}</ul>
          )}
        </li>
      ))}
    </>
  );
}
const websiteMapTDA = websiteMap.find((l) => l.name === "TDA");

export default function TDAPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Topological Data Analysis
      </Typography>

      <Typography variant="body1" component={"ul"} sx={{ margin: "0 0 1em" }}>
        {websiteMapTDA !== undefined &&
          websiteMapTDA.sub !== undefined &&
          generateLinks(websiteMapTDA.sub)}
      </Typography>
    </Container>
  );
}
