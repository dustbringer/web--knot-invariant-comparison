"use client";

import * as React from "react";

import Container from "@/components/Container";
import Link from "@/components/LinkInternal";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Container>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", width: "30vw", margin: "20vh auto" }}
      >
        Greetings. This website is currently under construction. Please visit one
        of the links above to see currently available plots.
      </Typography>
      <hr style={{ width: "300px" }} />
      <div>
        <Typography variant="h5" gutterBottom>
          (Old and buggy pages)
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
