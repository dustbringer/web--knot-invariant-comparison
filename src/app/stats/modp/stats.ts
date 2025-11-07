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
  count: {
    ylabel: "Number of polynomials with trivial jones mod p",
    xlabel: "Number of crossings",
    ylogscale: true,
    // yrange: [0, 100 + 5],
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "p=2",
      "p=3",
      "p=5",
      // "p=7",
    ],
    data: [
      [12, 6, 1, NaN],
      [13, 20, 1, NaN],
      [14, 74, 2, NaN],
      [15, 292, 4, NaN],
      [16, 1139, 30, NaN],
      [17, 4614, 128, 1],
      [18, 19035, 510, 1],
      [19, 80973, 1874, 4],
    ],
  },
  percentage: {
    ylabel: "Percentage of knots that have trivial jones mod p",
    xlabel: "Number of crossings",
    // ylogscale: true,
    // yrange: [0, 100 + 5],
    legend: {
      yanchor: "bottom",
      y: 0.01,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "p=2",
      "p=3",
      "p=5",
      // "p=7",
    ],
    data: [
      [12, 6 / 2977, 1 / 2977, NaN],
      [13, 20 / 12965, 1 / 12965, NaN],
      [14, 74 / 59937, 2 / 59937, NaN],
      [15, 292 / 313230, 4 / 313230, NaN],
      [16, 1139 / 1701935, 30 / 1701935, NaN],
      [17, 4614 / 8053393, 128 / 8053393, 1 / 8053393],
      [18, 19035 / 48266466, 510 / 48266466, 1 / 48266466],
      [19, 80973 / 342396924, 1874 / 342396924, 4 / 342396924],
    ],
  },
});

export default stats;
