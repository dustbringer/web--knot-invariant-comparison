"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Container from "@/components/Container";
import Link from "@/components/Link";

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Contact Details
      </Typography>
      <Typography variant="h6">Abel Lacabanne</Typography>
      <ul>
        <li>
          <Typography component="i">Address:</Typography> Laboratoire de
          Mathématiques Blaise Pascal (UMR 6620), Université Clermont Auvergne,
          Campus Universitaire des Cézeaux, 3 place Vasarely, 63178 Aubière
          Cedex, France
        </li>
        <li>
          <Typography component="i">Website:</Typography>{" "}
          <Link href="https://www.normalesup.org/~lacabanne/">www.normalesup.org/~lacabanne/</Link>
        </li>
        <li>
          <Typography component="i">Email address:</Typography>{" "}
          <Link href="mailto:abel.lacabanne@uca.fr">abel.lacabanne@uca.fr</Link>
        </li>
      </ul>

      <Typography variant="h6">Daniel Tubbenhauer</Typography>
      <ul>
        <li>
          <Typography component="i">Address:</Typography> The University of
          Sydney, School of Mathematics and Statistics F07, Office Carslaw 827,
          NSW 2006, Australia
        </li>
        <li>
          <Typography component="i">Website:</Typography>{" "}
          <Link href="https://www.dtubbenhauer.com">www.dtubbenhauer.com</Link>
        </li>
        <li>
          <Typography component="i">Email address:</Typography>{" "}
          <Link href="mailto:daniel.tubbenhauer@sydney.edu.au">
            daniel.tubbenhauer@sydney.edu.au
          </Link>
        </li>
      </ul>

      <Typography variant="h6">Pedro Vaz</Typography>
      <ul>
        <li>
          <Typography component="i">Address:</Typography> Institut de Recherche en Mathématique et Physique, Université catholique de Louvain, Che-
min du Cyclotron 2, 1348 Louvain-la-Neuve, Belgium
        </li>
        <li>
          <Typography component="i">Website:</Typography>{" "}
          <Link href="https://perso.uclouvain.be/pedro.vaz/">perso.uclouvain.be/pedro.vaz/</Link>
        </li>
        <li>
          <Typography component="i">Email address:</Typography>{" "}
          <Link href="mailto:pedro.vaz@uclouvain.be">
            pedro.vaz@uclouvain.be
          </Link>
        </li>
      </ul>

      <Typography variant="h6">Victor Zhang</Typography>
      <ul>
        <li>
          <Typography component="i">Address:</Typography> University of New
          South Wales (UNSW), School of Mathematics and Statistics, NSW 2052,
          Australia
        </li>
        <li>
          <Typography component="i">Website:</Typography>{" "}
          <Link href="https://dustbringer.github.io">
            dustbringer.github.io
          </Link>
        </li>
        <li>
          <Typography component="i">Email address:</Typography>{" "}
          <Link href="mailto:victor.l.zhang@unsw.edu.au">
            victor.l.zhang@unsw.edu.au
          </Link>
        </li>
      </ul>

      <Typography variant="h4" gutterBottom>
        Boring website construction details
      </Typography>
      <Typography variant="body1">
        The source code can be found on{" "}
        <Link href="https://github.com/dustbringer/web--knot-invariant-comparison">
          GitHub
        </Link>
        . The look uses <Link href="https://mui.com/"></Link>MaterialUI
        components. Statistic and root plots are displayed using{" "}
        <Link href="https://plotly.com/javascript/">Plotly</Link>. Ballmapper
        comparison is built with d3, using{" "}
        <Link href="https://d3js.org/d3-force">d3.force</Link> and{" "}
        <Link href="https://d3js.org/d3-drag">d3.drag</Link>.
      </Typography>
    </Container>
  );
}
