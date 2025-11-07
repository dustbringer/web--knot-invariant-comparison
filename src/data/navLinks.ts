export type Link = {
  name: string;
  path: string;
};

const navLinks: Link[] = [
  { name: "Detection", path: "/stats/detection" },
  { name: "Stats", path: "/stats" },
  { name: "Homology", path: "/stats/homology" },
  { name: "mod-p", path: "/stats/modp" },
  { name: "Roots", path: "/roots" },
  { name: "Ballmapper", path: "/bm" },
  { name: "About", path: "/about" },
];

export default navLinks;


