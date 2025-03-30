"use client";

import * as React from "react";

import Typography from "@mui/material/Typography";

import Container from "@/components/Container";
import Link from "@/components/Link";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Knot Invariant Comparison
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        This webpage contains various interactive plots and comparison tools
        that supplement the paper{" "}
        <Link href="https://arxiv.org/abs/2503.15810">arXiv</Link>. Relevant
        knot invariant data, scripts and more details on data collection are
        available on the{" "}
        <Link href="https://github.com/dtubbenhauer/quantumdata">
          GitHub page
        </Link>
        . All data displayed on this webpage, except average runtime, considers
        all prime knots (modulo mirrors) up to 16 crossings.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        <strong>Notice!</strong> While the website is expected to work on
        phones, less care has been put into polishing the mobile experience.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        <strong>Warning!</strong> The <Link href="/bm">Ballmapper</Link> page
        and old versions of the website fetch large files (~30-50MB per figure).
        So beware if you have bandwidth limits or slow internet.
      </Typography>
      <hr style={{ width: "300px", margin: "2em auto" }} />
      <div>
        <Typography variant="h5" gutterBottom>
          (Old and derelict versions of the website)
        </Typography>
        <ul>
          <li>
            <Link href="/old/14" inPlace>
              Up to 14 crossings
            </Link>
          </li>
          <li>
            <Link href="/old/15" inPlace>
              Up to 15 crossings
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
}
