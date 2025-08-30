export type Link = {
  name: string;
  path: string;
};

const navLinks: Link[] = [
  { name: "Stats", path: "/stats" },
  { name: "Homology", path: "/stats/homology" },
  { name: "Roots", path: "/roots" },
  { name: "Ballmapper", path: "/bm" },
  { name: "About", path: "/about" },
];

export default navLinks;


