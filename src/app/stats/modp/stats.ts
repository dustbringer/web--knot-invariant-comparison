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
    x: Array<number>;
    ys: Array<Array<number>>;
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
    x: [12, 13, 14, 15, 16, 17, 18, 19],
    ys: [
      [6, 20, 74, 292, 1139, 4614, 19035, 80973],
      [1, 1, 2, 4, 30, 128, 510, 1874],
      [NaN, NaN, NaN, NaN, NaN, 1, 1, 4],
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
    x: [12, 13, 14, 15, 16, 17, 18, 19],
    ys: [
      [
        6 / 2977,
        20 / 12965,
        74 / 59937,
        292 / 313230,
        1139 / 1701935,
        4614 / 8053393,
        19035 / 48266466,
        80973 / 342396924,
      ],
      [
        1 / 2977,
        1 / 12965,
        2 / 59937,
        4 / 313230,
        30 / 1701935,
        128 / 8053393,
        510 / 48266466,
        1874 / 342396924,
      ],
      [NaN, NaN, NaN, NaN, NaN, 1 / 8053393, 1 / 48266466, 4 / 342396924],
    ],
  },
});

export default stats;
