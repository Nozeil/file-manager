import readline from "readline";
import { exit } from "./exit.js";
import { logCurrentPath } from "./logCurrentPath.js";
import { stdin as input, stdout as output } from "process";
import { normalize } from "path";
import { currentPath } from "../index.js";

const COMMANDS = {
  up() {
    const newPath = normalize(`${currentPath.value}./..`);
    currentPath.value = newPath;
  },
  cd: "cd",
  ls: "ls",
};

export const useRl = () => {
  const rl = readline.createInterface({ input, output });

  rl.on("SIGINT", () => {
    exit(() => rl.close());
  });

  rl.on("line", (line) => {
    const isExit = line.startsWith(".exit");

    if (isExit) {
      exit(() => rl.close());
    }

    const isUp = line.startsWith("up");

    if (isUp) {
      COMMANDS.up();
    }

    logCurrentPath();
  });
};
