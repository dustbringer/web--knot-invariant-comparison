import fs from "fs";

export function readLines(filename: string) {
  const file = fs.readFileSync(filename).toString().trimEnd();
  return file.length > 0 ? file.split("\n") : [];
}
export function writeLines(filename: string, lines: Array<string>) {
  return fs.writeFileSync(filename, lines.map((line) => `${line}\n`).join(""));
}
export function appendLines(filename: string, lines: Array<string>) {
  return fs.appendFileSync(filename, lines.map((line) => `${line}\n`).join(""));
}

export function appendLinesLoop(filename: string, lines: Array<string>) {
  for (let i = 0; i < lines.length; i++) {
    fs.appendFileSync(filename, `${lines[i]}\n`);
  }
}
