import React from "react";
import MUIRadio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function Radios({
  title,
  options,
  value,
  onChange = () => {},
}: {
  title?: string;
  options: Array<{
    name: string;
    value: string;
  }>;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLElement>) => void;
}) {
  return (
    // <ToggleButtonGroup
    //   size="small"
    //   exclusive
    //   value={current}
    //   onChange={onChange}
    // >
    //   {buttons.map(({ name, value }) => (
    //     <ToggleButton value={value} key={value}>
    //       {name}
    //     </ToggleButton>
    //   ))}
    // </ToggleButtonGroup>

    <FormControl>
      {title && title.length > 0 && <FormLabel>{title}</FormLabel>}
      <RadioGroup row value={value} onChange={onChange}>
        {options.map(({ name, value }) => (
          <FormControlLabel
            value={value}
            label={name}
            key={value}
            control={<MUIRadio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
