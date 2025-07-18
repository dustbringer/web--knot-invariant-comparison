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
    showSuccessiveQuotients?: boolean;
    successiveQuotientsLegend?: {
      yanchor: "top" | "bottom";
      y: number;
      xanchor: "left" | "right";
      x: number;
    };
  };
} = Object.freeze({
  avgtime: {
    ylabel: "Average time (s) (log scale)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "A2",
      "Alexander",
      "B1 (R-matrix)",
      "B1 (Skein theory)",
      "Jones (R-matrix)",
      "Jones (Skein theory)",
      "Khovanov",
    ],
    data: [
      [3, 0.000961, 0.000548, 0.04195, 0.006364, 0.000952, 0.001487, 0.000819],
      [4, 0.001044, 0.000474, 0.058764, 0.029009, 0.001174, 0.001221, 0.001009],
      [5, 0.001204, 0.000413, 0.063757, 0.027541, 0.001359, 0.00094, 0.001187],
      [6, 0.00154, 0.000371, 0.073052, 0.106084, 0.002156, 0.002957, 0.001333],
      [7, 0.002078, 0.000344, 0.1098, 0.152202, 0.002442, 0.00238, 0.001458],
      [8, 0.006668, 0.000327, 0.146327, 0.382624, 0.003204, 0.002418, 0.001624],
      [9, 0.010328, 0.00034, 0.434684, 0.700274, 0.004329, 0.003016, 0.001772],
      [
        10, 0.022115, 0.000377, 0.727308, 2.001462, 0.005811, 0.003512,
        0.001989,
      ],
      [11, 0.035645, 0.000447, 41.247445, 5.64135, 0.007834, 0.004208, 0.00209],
      [12, 0.07314, 0.0008, 13.954301, 30.957447, 0.01032, 0.007081, 0.002089],
      [
        13, 0.189876, 0.001039, 28.231526, 94.590263, 0.012261, 0.007029,
        0.00225,
      ],
      [
        14, 0.393864, 0.001244, 113.210082, 535.15462, 0.016506, 0.00986,
        0.002312,
      ],
    ],
  },
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
      "Jones",
      "Khovanov",
      "KhovanovT1",
      "Jones+KhovanovT1",
      "All",
    ],
    data: [
      [3, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [4, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [5, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [6, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [7, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [8, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [9, 100.0, 94.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0],
      [10, 98.7, 84.7, 100.0, 96.3, 96.3, 96.3, 96.3, 100.0],
      [11, 95.8, 68.7, 98.1, 90.1, 91.1, 90.7, 91.1, 98.1],
      [12, 92.1, 59.5, 96.6, 83.0, 84.3, 83.8, 84.1, 96.7],
      [13, 85.7, 43.4, 92.3, 73.3, 77.5, 77.1, 77.4, 92.6],
      [14, 81.2, 33.6, 89.3, 64.4, 69.0, 68.4, 68.9, 89.6],
      [15, 76.4, 24.5, 86.2, 55.7, 60.6, 59.8, 60.6, 86.4],
      [16, 74.0, 18.6, 83.8, 49.4, 54.7, 53.6, 54.6, 84.0],
      [17, 73.6, 14.3, NaN, 44.8, 51.9, 50.4, 51.9, NaN],
      [18, 73.8, 11.1, NaN, 41.6, 50.8, 49.0, 50.8, NaN],
    ],
  },
  random: {
    ylabel: "Average comparisons until equal (log scale) (100,000 trials)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "A2",
      "Alexander",
      "B1",
      "Jones",
      "Khovanov",
      "KhovanovT1",
      "Jones+KhovanovT1",
      "All",
    ],
    data: [
      [4, 1.0, 0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0],
      [5, 2.9, 3.0, 2.9, 2.9, 2.9, 2.9, 3.0, 2.9],
      [6, 6.0, 5.9, 6.0, 6.0, 6.0, 5.9, 5.9, 5.9],
      [7, 13.0, 12.9, 12.9, 13.0, 12.9, 12.9, 12.9, 12.9],
      [8, 34.1, 33.9, 34.0, 34.0, 33.9, 34.1, 34.0, 34.0],
      [9, 83.2, 74.0, 82.9, 82.8, 83.2, 82.3, 83.1, 82.7],
      [10, 241.9, 187.0, 247.4, 231.0, 232.6, 231.7, 230.7, 250.4],
      [11, 738.4, 417.1, 764.5, 662.1, 673.2, 671.5, 676.0, 768.4],
      [12, 2532.7, 1147.5, 2791.9, 2098.2, 2141.2, 2117.2, 2134.0, 2794.7],
      [13, 9579.0, 2638.0, 11090.3, 7145.8, 7902.2, 7846.9, 7916.5, 11077.2],
      [
        14, 39876.6, 6679.7, 47869.6, 25740.7, 28845.6, 28586.1, 29036.8,
        48079.8,
      ],
      [
        15, 181201.6, 15376.9, 230546.2, 98445.1, 115234.8, 112986.8, 114700.2,
        231711.7,
      ],
      [
        16, 909889.2, 34001.2, 1161532.7, 394876.7, 475079.0, 460340.4,
        473986.2, 1157489.3,
      ],
    ],
  },
  randomZoomed: {
    ylabel: "Average comparisons until equal (100,000 trials)",
    xlabel: "Number of crossings",
    ylogscale: false,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: [
      "A2",
      "Alexander",
      "B1",
      "Jones",
      "Khovanov",
      "KhovanovT1",
      "Jones+KhovanovT1",
      "All",
    ],
    data: [
      [13, 9579.0, 2638.0, 11090.3, 7145.8, 7902.2, 7846.9, 7916.5, 11077.2],
      [
        14, 39876.6, 6679.7, 47869.6, 25740.7, 28845.6, 28586.1, 29036.8,
        48079.8,
      ],
      [
        15, 181201.6, 15376.9, 230546.2, 98445.1, 115234.8, 112986.8, 114700.2,
        231711.7,
      ],
      [
        16, 909889.2, 34001.2, 1161532.7, 394876.7, 475079.0, 460340.4,
        473986.2, 1157489.3,
      ],
    ],
  },
  maxMaxAbs: {
    ylabel: "Maximum coeffcient (log scale)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "Khovanov", "KhovanovT1"],
    data: [
      [3, 2, 1, 1, 1, 1, 1],
      [4, 2, 3, 1, 1, 1, 2],
      [5, 2, 3, 2, 2, 1, 2],
      [6, 2, 5, 2, 3, 2, 3],
      [7, 2, 9, 5, 4, 3, 5],
      [8, 4, 13, 17, 9, 5, 8],
      [9, 4, 23, 40, 13, 7, 12],
      [10, 6, 37, 76, 21, 11, 20],
      [11, 9, 59, 202, 34, 18, 34],
      [12, 11, 109, 517, 61, 31, 58],
      [13, 22, 163, 1440, 103, 53, 100],
      [14, 31, 281, 3474, 177, 89, 167],
      [15, 56, 451, 10063, 305, 157, 296],
      [16, 87, 813, 26219, 533, 267, 503],
      [17, 141, 1397, NaN, 873, 448, 844],
      [18, 251, 2369, NaN, 1587, 794, 1499],
    ],
    showSuccessiveQuotients: true,
    successiveQuotientsLegend: {
      yanchor: "top",
      y: 1.1,
      xanchor: "right",
      x: 0.99,
    },
  },
  maxSumAbs: {
    ylabel: "Maximum coeffcient sum (log scale)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "Khovanov", "KhovanovT1"],
    data: [
      [3, 7, 3, 9, 3, 4, 4],
      [4, 7, 5, 9, 5, 6, 6],
      [5, 9, 7, 9, 7, 8, 8],
      [6, 9, 13, 27, 13, 14, 14],
      [7, 11, 21, 53, 21, 22, 22],
      [8, 19, 45, 203, 45, 46, 46],
      [9, 27, 75, 475, 75, 76, 76],
      [10, 37, 121, 987, 121, 122, 122],
      [11, 57, 209, 2609, 209, 210, 210],
      [12, 101, 377, 7287, 377, 378, 378],
      [13, 163, 663, 20047, 663, 664, 664],
      [14, 257, 1145, 51311, 1145, 1146, 1146],
      [15, 439, 2037, 146629, 2037, 2038, 2038],
      [16, 717, 3581, 397707, 3581, 3582, 3582],
      [17, 1145, 6061, NaN, 6061, 6062, 6062],
      [18, 1965, 11045, NaN, 11045, 11046, 11046],
    ],
    showSuccessiveQuotients: true,
  },
  avgSumAbs: {
    ylabel: "Average coeffcient sum (log scale)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "Khovanov", "KhovanovT1"],
    data: [
      [3, 7.0, 3.0, 9.0, 3.0, 4.0, 4.0],
      [4, 6.0, 4.0, 8.0, 4.0, 5.0, 5.0],
      [5, 7.0, 5.0, 8.5, 5.0, 6.0, 6.0],
      [6, 7.0, 7.5714, 12.7142, 7.5714, 8.5714, 8.5714],
      [7, 8.2857, 11.1428, 20.4285, 11.1428, 12.1428, 12.1428],
      [8, 10.5428, 18.8857, 46.3714, 18.8285, 19.9428, 19.9428],
      [9, 13.0238, 29.6666, 95.0476, 29.6428, 30.7142, 30.7142],
      [10, 17.2409, 47.6345, 202.6867, 47.5461, 48.8192, 48.8192],
      [11, 23.9762, 75.9538, 447.5218, 75.9837, 77.5205, 77.5205],
      [12, 33.3903, 119.2499, 955.8572, 119.3829, 121.4605, 121.4605],
      [13, 47.1625, 183.4964, 2034.3612, 184.118, 187.5322, 187.5322],
      [14, 66.6552, 278.7659, 4256.5323, 280.3088, 286.0564, 286.0564],
      [15, 92.9985, 412.9504, 8620.9249, 416.3381, 426.4781, 426.4781],
      [16, 130.3453, 607.3186, 17436.7151, 614.2326, 632.2439, 632.2439],
      [17, 180.1742, 881.0875, NaN, 893.9029, 924.9966, 924.9966],
      [18, 250.4776, 1270.7363, NaN, 1293.9886, 1347.5582, 1347.5582],
    ],
  },
  maxAvgAbs: {
    ylabel: "Maximum average coefficient (log scale)",
    xlabel: "Number of crossings",
    ylogscale: true,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 0.5384, 1.0, 0.3913, 0.75, 0.4444],
      [4, 0.5384, 1.6666, 0.3913, 1.0, 0.5454],
      [5, 0.5384, 2.3333, 0.3913, 1.1666, 0.6153],
      [6, 0.5384, 3.0, 0.6585, 1.8571, 0.9333],
      [7, 0.5384, 5.0, 1.1276, 2.625, 1.2941],
      [8, 0.76, 6.6, 3.8301, 5.0, 2.421],
      [9, 0.931, 11.4, 8.0508, 7.5, 3.619],
      [10, 1.2758, 21.0, 15.1846, 11.0, 5.3043],
      [11, 1.7272, 29.0, 36.7464, 17.4166, 8.4],
      [12, 2.7297, 43.8571, 94.6363, 29.0, 14.0],
      [13, 4.4054, 71.8571, 241.5301, 47.3571, 22.8965],
      [14, 6.2682, 124.4285, 576.528, 76.3333, 36.9677],
      [15, 10.7073, 213.0, 1543.4631, 127.3125, 61.7575],
      [16, 15.9333, 304.1111, 3937.693, 210.647, 102.3428],
      [17, 25.4444, 618.3333, NaN, 336.7222, 163.8378],
      [18, 40.102, 1047.6666, NaN, 581.3157, 283.2307],
    ],
  },
  maxSpan: {
    ylabel: "Maximum span",
    xlabel: "Number of crossings",
    ylogscale: false,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 13, 3, 23, 4, 9],
      [4, 17, 3, 29, 5, 11],
      [5, 19, 5, 35, 6, 13],
      [6, 23, 5, 41, 7, 15],
      [7, 25, 7, 47, 8, 17],
      [8, 29, 7, 53, 9, 19],
      [9, 31, 9, 59, 10, 21],
      [10, 35, 9, 65, 11, 23],
      [11, 37, 11, 71, 12, 25],
      [12, 41, 11, 77, 13, 27],
      [13, 43, 13, 83, 14, 29],
      [14, 47, 13, 89, 15, 31],
      [15, 49, 15, 95, 16, 33],
      [16, 53, 15, 101, 17, 35],
      [17, 55, 17, NaN, 18, 37],
      [18, 59, 17, NaN, 19, 39],
    ],
  },
  avgSpan: {
    ylabel: "Average span",
    xlabel: "Number of crossings",
    ylogscale: false,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 13.0, 3.0, 23.0, 4.0, 9.0],
      [4, 15.0, 3.0, 26.0, 4.5, 10.0],
      [5, 16.5, 3.5, 30.5, 5.25, 11.5],
      [6, 18.7142, 3.8571, 35.0, 6.0, 13.0],
      [7, 21.2857, 4.2857, 41.0, 7.0, 15.0],
      [8, 23.9714, 5.1142, 47.1142, 8.0, 17.0],
      [9, 26.6428, 5.5238, 52.8809, 8.9523, 18.9047],
      [10, 29.0321, 6.3253, 58.9036, 9.9437, 20.8955],
      [11, 31.6117, 6.9001, 64.5056, 10.8514, 22.7153],
      [12, 33.9183, 7.5072, 70.0755, 11.7638, 24.5391],
      [13, 36.0324, 8.1801, 75.202, 12.5885, 26.1881],
      [14, 38.2418, 8.6834, 80.2214, 13.3948, 27.8008],
      [15, 40.1237, 9.2937, 85.0202, 14.1587, 29.3301],
      [16, 42.1702, 9.7961, 89.7204, 14.903, 30.8202],
      [17, 44.0453, 10.3246, NaN, 15.6368, 32.2899],
      [18, 45.9543, 10.8451, NaN, 16.3556, 33.7298],
    ],
  },
  maxAbsRoot: {
    ylabel: "Maximum absolute root",
    xlabel: "Number of crossings",
    ylogscale: false,
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "left",
      x: 0.01,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 1.1278, 1.0, 1.0731, 1.2106, 1.1168],
      [4, 1.1837, 2.618, 1.108, 1.2106, 1.2406],
      [5, 1.1837, 2.618, 1.1388, 1.2837, 1.2451],
      [6, 1.2196, 2.618, 1.199, 1.6355, 1.3042],
      [7, 1.2547, 3.3165, 1.2197, 1.6355, 1.6993],
      [8, 1.4348, 4.3902, 1.7655, 1.8692, 1.6993],
      [9, 1.7765, 5.1069, 1.8668, 3.3168, 1.798],
      [10, 1.7765, 5.1903, 1.8668, 3.3168, 1.9942],
      [11, 1.7765, 7.0507, 1.9518, 3.3168, 2.0254],
      [12, 2.0162, 8.7946, 2.299, 4.3519, 2.0504],
      [13, 2.1548, 10.0233, 2.4413, 4.9314, 2.1074],
      [14, 2.6858, 14.26, 2.7764, 5.6205, 2.33],
      [15, 2.7322, 22.4258, 3.7987, 6.4831, 2.4871],
      [16, 2.9737, 30.5071, 3.7987, 7.4391, 2.6661],
    ],
  },
  percentagePureRoots: {
    ylabel: "Percentage of real or purely imaginary roots (%)",
    xlabel: "Number of crossings",
    ylogscale: false,
    yrange: [0, 100 + 5],
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "right",
      x: 0.99,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 33.3333, 0.0, 9.0909, 33.3333, 0.0],
      [4, 28.5714, 50.0, 4.0, 14.2857, 11.1111],
      [5, 22.5806, 20.0, 5.0847, 17.647, 4.7619],
      [6, 22.5806, 30.0, 4.2016, 14.2857, 9.5238],
      [7, 21.1267, 17.3913, 4.2857, 14.2857, 10.204],
      [8, 19.9004, 25.0, 4.337, 11.0204, 11.4285],
      [9, 19.22, 21.5789, 5.1858, 11.3772, 11.7021],
      [10, 19.0257, 22.0211, 5.6457, 12.1688, 11.748],
      [11, 19.1843, 20.7786, 5.8111, 11.7222, 11.4177],
      [12, 18.8636, 20.958, 5.9901, 11.79, 10.9652],
      [13, 18.8596, 19.7378, 6.2311, 12.0096, 10.9197],
      [14, 18.7889, 20.0468, 6.3172, 12.0427, 10.6347],
      [15, 18.5564, 19.3164, 6.4275, 12.2916, 10.5783],
      [16, 18.5997, 19.4536, 6.4558, 12.3533, 10.4381],
    ],
  },
  percentageCircleRoots: {
    ylabel: "Percentage of roots with abs in [0.9, 1.1] (%)",
    xlabel: "Number of crossings",
    ylogscale: false,
    yrange: [0, 100 + 5],
    legend: {
      yanchor: "top",
      y: 0.99,
      xanchor: "right",
      x: 0.99,
    },
    columns: ["A2", "Alexander", "B1", "Jones", "KhovanovT1"],
    data: [
      [3, 33.3333, 100.0, 36.3636, 0.0, 0.0],
      [4, 57.1428, 50.0, 56.0, 57.1428, 11.1111],
      [5, 58.0645, 80.0, 61.0169, 23.5294, 14.2857],
      [6, 54.8387, 50.0, 65.5462, 22.8571, 16.6666],
      [7, 49.2957, 65.2173, 63.9285, 14.2857, 20.4081],
      [8, 47.7611, 52.7777, 60.4708, 20.4081, 21.0714],
      [9, 50.3249, 53.1578, 59.2932, 19.7604, 22.0744],
      [10, 49.4842, 45.7013, 56.9288, 20.9699, 22.285],
      [11, 49.5595, 43.9272, 56.0352, 22.0884, 22.7319],
      [12, 48.8356, 41.2244, 54.271, 23.3678, 24.0139],
      [13, 48.4072, 39.19, 53.3642, 23.9913, 24.6212],
      [14, 48.6044, 36.9571, 52.5937, 24.048, 25.0827],
      [15, 47.916, 35.878, 51.76, 23.5892, 25.3112],
      [16, 47.5652, 34.3872, 51.1914, 23.4344, 25.6379],
    ],
  },
});

export default stats;
