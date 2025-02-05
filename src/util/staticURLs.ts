export const baseURL = "/web--knot-invariant-comparison";

export default function staticify(url: string) {
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
}
