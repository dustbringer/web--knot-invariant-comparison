import { performance } from "perf_hooks";
import v8Profiler from "v8-profiler-next";
import fs from "fs";

export const timerPrint = (f: () => void) =>
  console.log("Time(ms): ", timer(f));

const timer = (f: () => void) => {
  const startTime = performance.now();
  f();
  const endTime = performance.now();
  return endTime - startTime;
};
export default timer;

export function profiler(title: string, f: () => void) {
  v8Profiler.setGenerateType(1);
  v8Profiler.startProfiling(title, true);
  f();
  const profile = v8Profiler.stopProfiling(title);
  profile.export((error, result) => {
    fs.writeFileSync(`data/${title}.cpuprofile`, result as string);
    profile.delete();
  });
}
