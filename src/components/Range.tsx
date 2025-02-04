import { ChangeEventHandler } from "react";

import Slider from "@mui/material/Slider";

function Range({
  max,
  min,
  value,
  onChange,
}: {
  max: number;
  min: number;
  value: number;
  onChange: (event: Event) => void;
}) {
  return (
    <>
      <Slider
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={10}
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
