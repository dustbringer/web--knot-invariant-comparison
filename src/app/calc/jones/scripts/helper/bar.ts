import cliProgress from "cli-progress";

export const createBar = () =>
  new cliProgress.SingleBar(
    {
      format:
        "{bar} {percentage}% = {value}/{total} | ETA: {eta_formatted} | Elapsed: {duration_formatted}",
    },
    cliProgress.Presets.shades_classic
  );
