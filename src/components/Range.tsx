import { ChangeEventHandler } from "react";

import Slider from "@mui/material/Slider";

function Range({
  max,
  min,
  value,
  onChange,
  step = 1,
}: {
  max: number;
  min: number;
  value: number;
  step?: number;
  onChange: (event: Event) => void;
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
        marks={[
          {
            value: min,
            label: String(min),
          },
          {
            value: 10000,
            label: "10000",
          },
        ]}
      />
    </>
  );
}

export default Range;
