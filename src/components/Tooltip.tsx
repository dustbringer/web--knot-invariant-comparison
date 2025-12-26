import React from "react";

import { styled } from "@mui/material/styles";
import MUITooltip, {
  TooltipProps,
  tooltipClasses,
} from "@mui/material/Tooltip";

// Styling from https://mui.com/material-ui/react-tooltip/#customization

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MUITooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default Tooltip;
