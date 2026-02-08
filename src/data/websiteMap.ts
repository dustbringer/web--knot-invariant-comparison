export type Link = {
  name: string;
  path?: string;
  sub?: Link[];
};

const websiteMap: Link[] = [
  {
    name: "Stats",
    path: "/stats",
    sub: [
      { name: "Detection", path: "/stats/detection" },
      { name: "Detection (up to mutation)", path: "/stats/detection/mutants" },
      {
        name: "Detection (ordered by volume)",
        path: "/stats/detection-volume",
      },
      { name: "Homology", path: "/stats/homology" },
      { name: "Distribution", path: "/stats/dist" },
      { name: "Rank plots", path: "/stats/rank" },
      { name: "Boxplot (computation time)", path: "/stats/boxplot" },
      { name: "Mod p", path: "/stats/modp" },
    ],
  },
  { name: "Roots", path: "/roots" },
  {
    name: "TDA",
    path: "/tda",
    sub: [
      {
        name: "Ballmapper",
        path: "/tda/ballmapper",
        sub: [
          { name: "Alternating", path: "/tda/ballmapper/a" },
          { name: "Non-alternating", path: "/tda/ballmapper/n" },
        ],
      },
      { name: "k-Nearest neighbours", path: "/tda/k-nearest-neighbours" },
      { name: "Persistent Homology", path: "/tda/persistent-homology" },
    ],
  },
  { name: "Jones Calculator", path: "/calc/jones" },
  { name: "Plot tool", path: "/plot" },
  { name: "About", path: "/about" },
  // { name: "KL", path: "https://dustbringer.github.io/web--kl-poly-data/" },
];

export default websiteMap;
