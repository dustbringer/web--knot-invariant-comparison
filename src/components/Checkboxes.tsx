import React from "react";
import MUICheckbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function Checkboxes({
  title,
  options,
  checked,
  disabled,
  onChange = () => {},
}: {
  title?: string;
  options: Array<{
    name: string;
    value: string;
  }>;
  checked: { [name: string]: boolean };
  disabled?: { [name: string]: boolean };
  onChange?: (name: string, e: React.ChangeEvent<HTMLElement>) => void;
}) {
  return (
    <FormControl>
      {title && title.length > 0 && <FormLabel>{title}</FormLabel>}
      <FormGroup row>
        {options.map(({ name, value }) => (
          <FormControlLabel
            label={name}
            key={value}
            control={
              <MUICheckbox
                disabled={disabled ? !!disabled[value] : false}
                checked={!!checked[value]}
                onChange={(e) => onChange(value, e)}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
