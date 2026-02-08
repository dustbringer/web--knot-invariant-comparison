export type Link = {
  name: string;
  path: string;
};

const navLinks: Link[] = [
  { name: "Overview", path: "/" },
  { name: "Detection", path: "/stats/detection" },
  { name: "Stats", path: "/stats" },
  { name: "mod-p", path: "/stats/modp" },
  { name: "Roots", path: "/roots" },
  { name: "TDA", path: "/tda" },
  { name: "About", path: "/about" },
  { name: "KL", path: "https://dustbringer.github.io/web--kl-poly-data/" },
];

export default navLinks;
