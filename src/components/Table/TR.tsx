import * as React from "react";

import { SxProps } from "@mui/material";
import TableRow from "@mui/material/TableRow";

function TR(props: React.PropsWithChildren<{ sx?: SxProps }>) {
  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          "&:nth-of-type(odd)": {
            backgroundColor: "white",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#f7f7f7",
          },
        }} // last element has no bottom border
        {...props}
      />
    </>
  );
}

export default TR;
