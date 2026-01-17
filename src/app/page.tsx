"use client";

import * as React from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Container from "@/components/Container";
import Link from "@/components/Link";
import Accordion from "@/components/Accordion";

import descriptions from "./descriptions";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Knot Invariant Comparison
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        This webpage contains various interactive plots and comparison tools
        that supplement the papers [
        <Link href="https://arxiv.org/abs/2503.15810">arXiv</Link>;{" "}
        <Link href="https://github.com/dtubbenhauer/quantumdata">GitHub</Link>]
        and [<Link href="https://arxiv.org/abs/2509.05574">arXiv</Link>;{" "}
        <Link href="https://github.com/dtubbenhauer/knotdetection">GitHub</Link>
        ]. Relevant knot invariant data, scripts and more details on data
        collection are available on the corresponding GitHub pages. Most data
        displayed on this webpage considers all prime knots (not distinguishing
        mirrors) up to 16 crossings. More computable invariants have data up to
        19 crossings, while harder invariants have lower values.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        <strong>Notice!</strong> While the website probably works on phones,
        less care has been put into polishing the mobile experience.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: ".5em" }}>
        <strong>Warning!</strong> The <Link href="/bm">Ballmapper</Link> page
        and old versions of the website fetch large files (~30-50MB per figure).
        So beware if you have bandwidth limits or slow internet.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Website Map
      </Typography>
      <Typography variant="body1" component={"ul"} sx={{ margin: "0 0 1em" }}>
        <li>
          <Link href="/stats" inPlace>
            Stats
          </Link>
          <ul>
            <li>
              <Link href="/stats/detection" inPlace>
                Detection
              </Link>
            </li>
            <li>
              <Link href="/stats/detection-volume" inPlace>
                Detection (ordered by volume)
              </Link>
            </li>
            <li>
              <Link href="/stats/homology" inPlace>
                Homology
              </Link>
            </li>
            <li>
              <Link href="/stats/dist" inPlace>
                Distribution
              </Link>
            </li>
            <li>
              <Link href="/stats/rank" inPlace>
                Rank plots
              </Link>
            </li>
            <li>
              <Link href="/stats/boxplot" inPlace>
                Boxplot (computation time)
              </Link>
            </li>
            <li>
              <Link href="/stats/modp" inPlace>
                Mod p
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link href="/roots" inPlace>
            Roots
          </Link>
        </li>
        <li>
          <Link href="/bm" inPlace>
            Ballmapper
          </Link>
          <ul>
            <li>
              <Link href="/bm/a" inPlace>
                Alternating
              </Link>
            </li>
            <li>
              <Link href="/bm/n" inPlace>
                Non-alternating
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link href="/calc/jones" inPlace>
            Jones calculator
          </Link>
        </li>
        <li>
          <Link href="/plot" inPlace>
            Plot tool
          </Link>
        </li>

        <li>
          <Link href="/about" inPlace>
            About
          </Link>
        </li>
      </Typography>

      <Typography variant="h5" gutterBottom>
        References and acknowledgements
      </Typography>
      <Typography variant="body1" component={"span"} gutterBottom>
        Papers (submitted after 2019) detailing invariants and techniques we used
        <ul>
          <li>
            P. Dłotko,{" "}
            <em>Ball mapper: a shape summary for topological data analysis</em>,{" "}
            2019 [<Link href="https://arxiv.org/abs/1901.07410">arXiv</Link>]
          </li>
          <li>
            S. Garoufalidis, R. Kashaev,{" "}
            <em>
              Multivariable knot polynomials from braided Hopf algebras with
              automorphisms
            </em>
            , 2023 [<Link href="https://arxiv.org/abs/2311.11528">arXiv</Link>]
          </li>
          <li>
            D. Bar-Natan, R. van der Veen,{" "}
            <em>
              A Fast, Strong, Topologically Meaningful and Fun Knot Invariant
            </em>
            , 2025 [<Link href="https://arxiv.org/abs/2509.18456">arXiv</Link>]
          </li>
        </ul>
        The list of knots we used come from
        <ul>
          <li>
            KnotInfo (C. Livingston, A.H. Moore) [
            <Link href="https://knotinfo.org/homelinks/database_download.php">
              website
            </Link>
            ]
          </li>
          <li>
            Regina: Software for low-dimensional topology (B.A. Burton, R.
            Budney, W. Pettersson) [
            <Link href="https://regina-normal.github.io/data.html">
              website
            </Link>
            ]
          </li>
        </ul>
      </Typography>

      <hr style={{ width: "300px", margin: "2em auto" }} />

      <Box>
        <Accordion title="Invariant Details">
          <Typography variant="body1">
            Short descriptions of the invariants and their abbreviations used in
            some plots.
          </Typography>
          <TableContainer
            sx={{
              margin: "1em auto",
              border: "1px solid lightgrey",
              borderRadius: "5px",
              width: "fit-content",
            }}
          >
            <Table size="small" sx={{ width: "auto" }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                  >
                    Abbreivation
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "600", borderBottomWidth: "3px" }}
                  >
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(descriptions).map((col, i) => (
                  <TableRow key={`abbrTable-row${i}`}>
                    <TableCell key={`abbrTable-row${i},col${0}`}>
                      {col}
                    </TableCell>
                    <TableCell key={`abbrTable-row${i},col${1}`}>
                      {descriptions[col].abbr}
                    </TableCell>
                    <TableCell key={`abbrTable-row${i},col${2}`}>
                      {descriptions[col].description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Accordion>

        <Accordion title="Old and derelict versions of the website">
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
        </Accordion>
      </Box>
    </Container>
  );
}
