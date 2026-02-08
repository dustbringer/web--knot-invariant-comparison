import { range } from "@/util/array-util";

// [# only 1 knot, # only 2 knots, most duplicates]
type StatsType = {
  [name: string]: {
    all: number[];
    all_total: number;
    all_max: number;
    a: number[];
    a_total: number;
    a_max: number;
    n: number[];
    n_total: number;
    n_max: number;
  };
};
const stats: StatsType = {
  ["a2-3-16"]: {
    all: [967274, 217054, 32384],
    all_total: 1259538,
    all_max: 24,
    a: [323954, 55244, 5936],
    a_total: 393832,
    a_max: 20,
    n: [651774, 161043, 25661],
    n_total: 871739,
    n_max: 24,
  },
  ["alexander-3-16"]: {
    all: [141352, 57426, 28313],
    all_total: 317540,
    all_max: 923,
    a: [103432, 36515, 16554],
    a_total: 190336,
    a_max: 143,
    n: [67399, 30571, 15766],
    n_total: 172514,
    n_max: 922,
  },
  ["b1-3-16"]: {
    all: [1221161, 172630, 5604],
    all_total: 1426810,
    all_max: 16,
    a: [365739, 45270, 1519],
    a_total: 419710,
    a_max: 16,
    n: [855422, 127360, 4085, 17922],
    n_total: 1007100,
    n_max: 16,
  },
  ["bnvdv-3-16"]: {
    all: [1625754, 31112, 874],
    all_total: 1659901,
    all_max: 1919,
    a: [469321, 9158, 140],
    a_total: 479079,
    a_max: 1354,
    n: [1156549, 21981, 726],
    n_total: 1180932,
    n_max: 565,
  },
  ["hfk2-3-16"]: {
    all: [402627, 124710, 42343],
    all_total: 663079,
    all_max: 410,
    a: [139931, 44574, 17664],
    a_total: 232370,
    a_max: 85,
    n: [299753, 90260, 27727],
    n_total: 479535,
    n_max: 390,
  },
  ["hfk2-t1-3-16"]: {
    all: [137296, 56311, 27333],
    all_total: 308923,
    all_max: 510,
    a: [103432, 36515, 16554],
    a_total: 190336,
    a_max: 143,
    n: [63468, 29584, 14720],
    n_total: 164234,
    n_max: 494,
  },
  ["homflypt-3-16"]: {
    all: [967853, 216890, 32325],
    all_total: 1259880,
    all_max: 24,
    a: [323975, 55237, 5934],
    a_total: 393844,
    a_max: 20,
    n: [652251, 160919, 25607],
    n_total: 872025,
    n_max: 24,
  },
  ["homflypt-homology-3-11"]: {
    all: [743, 26, 2],
    all_total: 771,
    all_max: 3,
    a: [523, 17, 2],
    a_total: 542,
    a_max: 3,
    n: [220, 9, 0],
    n_total: 229,
    n_max: 2,
  },
  ["homflypt-homology-partial-3-13"]: {
    all: [10767, 826, 119],
    all_total: 11756,
    all_max: 7,
    a: [5211, 595, 80],
    a_total: 5907,
    a_max: 6,
    n: [5892, 155, 10],
    n_total: 6058,
    n_max: 4,
  },
  ["jones-3-16"]: {
    all: [495163, 179862, 60803],
    all_total: 841145,
    all_max: 61,
    a: [208565, 59007, 17374],
    a_total: 305966,
    a_max: 28,
    n: [299196, 123081, 43590],
    n_total: 548483,
    n_max: 61,
  },
  ["khovanov-3-16"]: {
    all: [586298, 193876, 58619],
    all_total: 931204,
    all_max: 52,
    a: [209868, 58776, 17253],
    a_total: 306817,
    a_max: 28,
    n: [386003, 136856, 41444],
    n_total: 634514,
    n_max: 52,
  },
  ["khovanov-t1-3-16"]: {
    all: [565054, 192900, 59640],
    all_total: 912778,
    all_max: 67,
    a: [209868, 58776, 17253],
    a_total: 306817,
    a_max: 28,
    n: [365096, 135972, 42445],
    n_total: 616433,
    n_max: 64,
  },
  ["khodd-3-16"]: {
    all: [561497, 190180, 59094],
    all_total: 906628,
    all_max: 52,
    a: [209868, 58776, 17253],
    a_total: 306817,
    a_max: 28,
    n: [363652, 133547, 41993],
    n_total: 612497,
    n_max: 52,
  },
  ["kr3-3-15"]: {
    all: [195851, 38493, 5350],
    all_total: 245072,
    all_max: 15,
    a: [77362, 11786, 1566],
    a_total: 92048,
    a_max: 10,
    n: [120685, 26395, 3596],
    n_total: 154515,
    n_max: 15,
  },
};

export default stats;
