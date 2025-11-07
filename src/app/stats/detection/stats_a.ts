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
      [3 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [4 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [5 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [6 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [7 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [8 , 100    , 100    , 100    , 100    , 100    , 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [9 , 100    , 94.5205, 100    , 95.8904, 94.5205, 100    , NaN, 100    , 100    , 100    , 100    , 100],
      [10, 98.9795, 90.8163, 100    , 92.3469, 90.8163, 98.9795, NaN, 95.9183, 95.9183, 95.9183, 95.9183, 98.9795],
      [11, 96.4476, 78.6856, 98.9342, 84.9023, 78.6856, 96.4476, NaN, 91.6518, 91.6518, 91.6518, 91.6518, 96.4476],
      [12, 93.8411, 72.7174, 97.6229, 79.5786, 72.7174, 93.8411, NaN, 85.7914, 85.8454, 85.8454, 85.8454, 93.8411],
      [13, 89.2851, 59.3698, 94.5014, 68.5837, 59.3698, 89.2851, NaN, 78.7189, 78.8378, 78.8378, 78.8378, 89.3000],
      [14, 85.9623, 51.9360, 91.9398, 60.8452, 51.9360, 85.9623, NaN, 72.3662, 72.5223, 72.5223, 72.5223, NaN],
      [15, 82.4420, 43.6186, 88.5445, 52.8530, 43.6186, 82.4420, NaN, 66.2766, 66.4514, 66.4514, 66.4514, NaN],
      [16, 80.1567, 38.7391, 85.4237, 47.2943, 38.7391, 80.1592, NaN, 62.2733, 62.4465, 62.4465, 62.4465, NaN],
      [17, 78.2553, 34.8151, NaN    , 41.1198, 34.8151, 78.2580, NaN, 58.5878, 58.7402, 58.7402, 58.7402, NaN],
      [18, 76.8613, 32.1571, NaN    , 37.6066, 32.1571, 76.8653, NaN, 57.5974, 57.7236, 57.7236, 57.7236, NaN],
    ],
  },
});

export default stats;
