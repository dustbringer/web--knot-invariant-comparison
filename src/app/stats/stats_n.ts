const stats: {
  [name: string]: {
    ylabel: string;
    xlabel: string;
    ylogscale?: boolean;
    yrange?: [number, number];
    legend: {
      yanchor: "top" | "bottom";
      y: number;
      xanchor: "left" | "right";
      x: number;
    };
    columns: Array<string>;
    abbreviate?: boolean;
    columnsAbbr: Array<string>;
    data: Array<Array<number>>;
    showSuccessiveQuotients?: boolean;
    successiveQuotientsLegend?: {
      yanchor: "top" | "bottom";
      y: number;
      xanchor: "left" | "right";
      x: number;
    };
  };
} = Object.freeze({
  unique: {
    ylabel: "Percentage of unique values (%)",
    xlabel: "Number of crossings",
    ylogscale: false,
    yrange: [0, 100 + 5],
    legend: {
      yanchor: "bottom",
      y: 0.01,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "A2",
      "Alexander",
      "B1",
      "HFK2",
      "HFK2T1",
      "HOMFLYPT",
      "HOMFLYPTHomology",
      "Jones",
      "Khovanov",
      "KhovnovT1",
      "KhovnovOdd",
      "KR3",
    ],
    abbreviate: true,
    columnsAbbr: [
      "A2",
      "A",
      "B1",
      "HFK2",
      "HFK2T1",
      "H",
      "HH",
      "J",
      "K",
      "KT1",
      "KO",
      "KR3",
    ],
    data: [
      [3 , NaN    , NaN    , NaN    , NaN    , NaN    , NaN    , NaN, NaN    , NaN    , NaN    , NaN    , NaN],
      [4 , NaN    , NaN    , NaN    , NaN    , NaN    , NaN    , NaN, NaN    , NaN    , NaN    , NaN    , NaN],
      [5 , NaN    , NaN    , NaN    , NaN    , NaN    , NaN    , NaN, NaN    , NaN    , NaN    , NaN    , NaN],
      [6 , NaN    , NaN    , NaN    , NaN    , NaN    , NaN    , NaN, NaN    , NaN    , NaN    , NaN    , NaN],
      [7 , NaN    , NaN    , NaN    , NaN    , NaN    , NaN    , NaN, NaN    , NaN    , NaN    , NaN    , NaN],
      [8 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [9 , 100    , 100    , 100    , 100    , 90.9090, 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [10, 100    , 94.3396, 100    , 96.2264, 92.4528, 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [11, 94.9579, 73.5294, 96.2184, 86.5546, 68.0672, 94.9579, NaN, 91.5966, 92.8571, 92.4369, 92.8571, 94.9579],
      [12, 91.7406, 59.2362, 95.1154, 74.9555, 54.7069, 91.7406, NaN, 84.2806, 86.4120, 85.5239, 86.0568, 92.3623],
      [13, 83.4188, 40.7793, 90.0416, 61.4977, 37.8928, 83.4188, NaN, 71.4400, 76.9082, 76.2668, 73.3643, 82.9104],
      [14, 78.6766, 28.8281, 87.3990, 51.6007, 26.8264, 78.6796, NaN, 61.0952, 68.4396, 67.5665, 63.9106, NaN],
      [15, 73.8584, 19.8009, 84.9237, 43.8751, 18.7315, 73.8659, NaN, 51.6390, 57.9751, 56.7426, 55.5601, NaN],
      [16, 72.0083, 14.2501, 83.1896, 39.6110, 13.5662, 72.0319, NaN, 45.3064, 52.4128, 50.9192, 50.5941, NaN],
      [17, 72.5596, 10.6507, NaN    , 36.8761, 10.2705, 72.6120, NaN, 41.3778, 50.5056, 48.6227, 48.7786, NaN],
      [18, 73.3275, 8.1801 , NaN    , 36.1803, 8.0215 , 73.4116, NaN, 38.4719, 49.7112, 47.4840, 48.0679, NaN],
    ],
  },
});

export default stats;
