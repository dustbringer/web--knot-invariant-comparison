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
  "unique mod-p": {
    ylabel: "Percentage of unique values (%)",
    xlabel: "Number of crossings",
    yrange: [0, 100 + 5],
    legend: {
      yanchor: "bottom",
      y: 0.01,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["p=0", "p=2", "p=3", "p=5", "p=7", "p=11"],
    x: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    ys: [
      [
        // p=0
        100, 100, 100, 100, 100, 100, 100, 96.3855, 90.1373, 83.003, 73.3127,
        64.4993, 55.7478, 49.4228, 44.8416, 41.6179, 40.1709,
      ],
      [
        // p=2
        100, 100, 100, 100, 100, 94.2857, 96.4285, 86.7469, 69.538, 48.6059,
        29.1399, 14.9306, 6.6309, 2.7184, 0.9805, 0.3586, 0.1277,
      ],
      [
        // p=3
        100, 100, 100, 100, 100, 100, 100, 95.5823, 89.1385, 79.8118, 67.5125,
        54.4288, 40.3604, 28.665, 18.4317, 11.6745, 7.2336,
      ],
      [
        // p=5
        100, 100, 100, 100, 100, 100, 100, 96.3855, 90.1373, 83.003, 73.305,
        64.4843, 55.6517, 49.0363, 43.5832, 38.8154, 35.0351,
      ],
      [
        // p=7
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        96.3855,
        90.1373,
        83.003,
        73.3127,
        64.4993,
        55.7478,
        49.4223,
        44.8302,
        41.5546,
        NaN,
      ],
      [
        // p=11
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        96.3855,
        90.1373,
        83.003,
        73.3127,
        64.4993,
        55.7478,
        49.4228,
        44.8416,
        41.6179,
        NaN,
      ],
    ],
  },
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
