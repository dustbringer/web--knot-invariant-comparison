import { ChangeEventHandler } from "react";

import Slider from "@mui/material/Slider";

function Range({
  max,
  min,
  value,
  onChange,
  step = 1,
  disabled = false,
  props = {},
}: {
  max: number;
  min: number;
  value: number;
  step?: number;
  onChange: (event: Event) => void;
  disabled?: boolean;
  props?: object;
}) {
  return (
    <>
      <Slider
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
        defaultValue={min}
        value={value}
        onChange={onChange}
        disabled={disabled}
        marks={[
          {
            value: min,
            label: String(min),
          },
          {
            value: max,
            label: String(max),
          },
        ]}
        {...props}
      />
    </>
  );
}

export default Range;
