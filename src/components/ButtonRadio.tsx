import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ButtonRadio({
  buttons,
  value,
  onChange = () => {},
}: {
  buttons: Array<{
    name: string;
    value: string;
  }>;
  value: string;
  onChange?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <ToggleButtonGroup size="small" exclusive value={value} onChange={onChange}>
      {buttons.map(({ name, value }) => (
        <ToggleButton value={value} key={value}>
          {name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
