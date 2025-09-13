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
    data: Array<Array<number>>;
  };
} = Object.freeze({
  khovanovFamily: {
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
      "Jones",
      "Khovanov",
      "KhovanovT1",
      "Jones+KhovanovT1",
      "KhovanovOdd",
      "Khovanov+KhovanovOdd",
    ],
    data: [
      [3, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [4, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [5, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [6, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [7, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [8, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [9, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [10, 96.38, 96.38, 96.38, 96.38, 96.38, 96.38],
      [11, 90.13, 91.13, 90.76, 91.13, 91.13, 91.13],
      [12, 83.0, 84.31, 83.84, 84.17, 84.11, 84.31],
      [13, 73.31, 77.5, 77.16, 77.44, 74.53, 77.5],
      [14, 64.49, 69.04, 68.47, 68.97, 66.28, 69.05],
      [15, 55.74, 60.69, 59.85, 60.64, 58.4, 60.77],
      [16, 49.42, 54.71, 53.63, 54.67, 53.27, 54.9],
      [17, 44.84, 51.93, 50.47, 51.9, 50.57, 52.33],
      [18, 41.61, 50.83, 49.0, 50.8, 49.48, 51.45],
    ],
  },
  hfkFamily: {
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
    columns: ["Alexander", "HFK2", "HFK2T1", "Alexander+HFK2T1"],
    data: [
      [3, 100.0, 100.0, 100.0, 100.0],
      [4, 100.0, 100.0, 100.0, 100.0],
      [5, 100.0, 100.0, 100.0, 100.0],
      [6, 100.0, 100.0, 100.0, 100.0],
      [7, 100.0, 100.0, 100.0, 100.0],
      [8, 100.0, 100.0, 100.0, 100.0],
      [9, 94.04, 95.23, 92.85, 94.04],
      [10, 84.73, 87.95, 83.53, 85.54],
      [11, 68.78, 79.4, 67.16, 70.78],
      [12, 59.55, 71.38, 57.8, 63.05],
      [13, 43.49, 59.31, 42.08, 49.61],
      [14, 33.69, 50.57, 32.54, 41.89],
      [15, 24.55, 43.27, 23.82, 35.13],
      [16, 18.65, 38.96, 18.15, 31.57],
      [17, 14.35, 35.82, 14.04, 29.61],
      [18, 11.19, 34.95, 11.05, 29.11],
    ],
  },
  kr3Family: {
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
    columns: ["SL3", "KR3"],
    data: [
      [3, 100.0, 100.0],
      [4, 100.0, 100.0],
      [5, 100.0, 100.0],
      [6, 100.0, 100.0],
      [7, 100.0, 100.0],
      [8, 100.0, 100.0],
      [9, 100.0, 100.0],
      [10, 98.79, 98.79],
      [11, 95.88, 95.88],
      [12, 92.13, 92.54],
      [13, 85.71, 86.45],
      [14, 81.2, 82.41],
      [15, 76.4, 78.24],
      [16, 74.0, NaN],
      [17, 73.65, NaN],
      [18, 73.84, NaN],
    ],
  },
  homflyFamily: {
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
    columns: ["HOMFLYPT", "HOMFLYPT Homology"],
    data: [
      [3, 100.0, 100.0],
      [4, 100.0, 100.0],
      [5, 100.0, 100.0],
      [6, 100.0, 100.0],
      [7, 100.0, 100.0],
      [8, 100.0, 100.0],
      [9, 100.0, 100.0],
      [10, 98.79, 99.59],
      [11, 95.88, 96.25],
      [12, 92.2, 93.24],
      [13, 85.73, 93.3],
      [14, 81.21, NaN],
      [15, 76.4, NaN],
      [16, 74.02, NaN],
      [17, 73.7, NaN],
      [18, 73.91, NaN],
    ],
  },
});

export default stats;
