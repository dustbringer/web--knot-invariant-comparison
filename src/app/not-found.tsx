import Container from "@/components/Container";
import { DivFlexCenterVJA } from "@/components/styled/Divs";
import { Typography } from "@mui/material";
import Link from "@/components/LinkBoldInternal";

export default function NotFound() {
  return (
    <Container maxWidth="lg">
      <DivFlexCenterVJA>
        <Typography variant="h4" gutterBottom>
          404: Page Not Found
        </Typography>
        <Typography variant="body1">
          <Link href="/" inPlace>Return home</Link>
        </Typography>
      </DivFlexCenterVJA>
    </Container>
  );
}
