import fs from "fs";
import readline from "readline";

import { createBar } from "./bar";

// https://stackoverflow.com/questions/45556535/nodejs-readline-only-read-the-first-2-lines
export async function readLine(filename: string, linenumber: number) {
  const linereader = readline.createInterface(fs.createReadStream(filename));
  let lineCounter = 0;
  for await (const line of linereader) {
    if (lineCounter === linenumber) {
      return line;
    } else {
      lineCounter++;
    }
  }
}

// slow beacuse we're reading the whole file
// but doesn't use much memory
export async function nLines(filename: string) {
  const linereader = readline.createInterface(fs.createReadStream(filename));
  let lineNumber = 0;
  for await (const line of linereader) {
    lineNumber++;
  }
  return lineNumber;
}

// reads the whole file into an array
// nLines is just for display
export async function readLines(
  filename: string,
  useBar: boolean = true,
  nlines: number = 0
) {
  const bar = createBar();
  useBar && bar.start(nlines, 0);

  const ret: Array<string> = [];
  const linereader = readline.createInterface(fs.createReadStream(filename));
  for await (const line of linereader) {
    ret.push(line.trimEnd());
    useBar && bar.increment();
  }
  useBar && bar.stop();
  return ret;
}

export async function mapLines<T>(
  filename: string,
  f: (line: string) => T,
  useBar: boolean = true,
  nlines: number = 0
): Promise<Array<T>> {
  const bar = createBar();
  useBar && bar.start(nlines, 0);

  const linereader = readline.createInterface(fs.createReadStream(filename));
  const ret: Array<T> = [];
  for await (const line of linereader) {
    ret.push(f(line));
    useBar && bar.increment();
  }
  useBar && bar.stop();
  return ret;
}

export async function forEachLine<T>(
  filename: string,
  f: (line: string) => T,
  useBar: boolean = true,
  nlines: number = 0
): Promise<number> {
  let nLines = 0;
  const bar = createBar();
  useBar && bar.start(nlines, 0);

  const linereader = readline.createInterface(fs.createReadStream(filename));
  for await (const line of linereader) {
    f(line);
    useBar && bar.increment();
    nLines += 1;
  }
  useBar && bar.stop();
  return nLines;
}

export async function mapLinesLarge<T>(
  filename: string,
  f: (line: string) => T,
  nlines: number = 0,
  groupSize: number = 1000000
): Promise<{ [mod10: number]: Array<T> }> {
  const bar = createBar();
  bar.start(nlines, 0);

  const linereader = readline.createInterface(fs.createReadStream(filename));
  const ret: { [group: number]: Array<T> } = {};
  let count = 0;
  for await (const line of linereader) {
    ret[count - (count % groupSize)] ??= [];
    ret[count - (count % groupSize)].push(f(line));
    bar.increment();
    count++;
  }
  bar.stop();
  return ret;
}

// write lots of lines
// https://stackoverflow.com/questions/30734373/writing-long-strings-to-file-node-js
export function writeLines(filename: string, lines: string[]) {
  const bar = createBar();
  bar.start(lines.length, 0);

  const wstream = fs.createWriteStream(filename);
  const linesWritten = 0;

  for (let i = 0; i < lines.length; i++) {
    wstream.write(`${lines[i]}\n`);
    bar.increment();
  }
  wstream.end();
  bar.stop();

  return linesWritten;
}

// write lots of lines synchronously
// https://stackoverflow.com/questions/11948290/confused-about-node-js-file-system
export function writeLinesSync(
  filename: string,
  lines: string[],
  useBar: boolean = true
) {
  const bar = createBar();
  useBar && bar.start(lines.length, 0);

  const writeFd = fs.openSync(filename, "w");
  const linesWritten = 0;

  for (let i = 0; i < lines.length; i++) {
    fs.writeSync(writeFd, `${lines[i]}\n`);
    useBar && bar.increment();
  }
  useBar && bar.stop();

  return linesWritten;
}
