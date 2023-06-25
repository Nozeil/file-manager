import readline from "readline/promises";
import { logCurrentPath } from "./logCurrentPath.js";
import { stdin as input, stdout as output } from "process";
import { logWithUsername } from "./logWithUsername.js";
import { logGoodbye } from "./logGoodbye.js";
import { chdir } from "process";

const COMMANDS = {
  [".exit"](close) {
    logWithUsername(logGoodbye);
    close();
  },
  up() {
    try {
      chdir("..");
    } catch {
      throw new Error("Something goes wrong");
    }
  },
  cd(line) {
    try {
      chdir(line);
    } catch {
      throw new Error("Directory does not exist");
    }
  },
  ls: "ls",
};

export const useRl = () => {
  const rl = readline.createInterface({
    input,
    output,
  });
  const close = () => rl.close();

  rl.on("SIGINT", () => {
    COMMANDS[".exit"](close);
  });

  rl.on("line", (line) => {
    const splitedLine = line.split(/ +(?=(?:"[^"]*"|[^"])*$)/);
    const firstCommand = splitedLine[0];
    const command = COMMANDS[firstCommand];
    console.log(splitedLine);

    if (command) {
      try {
        switch (firstCommand) {
          case ".exit": {
            if (splitedLine.length > 1) {
              throw new Error("Invalid number of arguments");
            }
            command(close);
            break;
          }
          case "up": {
            if (splitedLine.length > 1) {
              throw new Error("Invalid number of arguments");
            }
            command();
            break;
          }
          case "cd": {
            if (splitedLine.length > 2) {
              throw new Error("Invalid number of arguments");
            }
            const path = splitedLine[1];
            command(path);
            break;
          }
        }
      } catch (error) {
        console.error(error.message);

        if (firstCommand === ".exit") {
          logCurrentPath();
        }
      }
    } else {
      console.error("No such command");
    }

    if (firstCommand !== ".exit") {
      logCurrentPath();
    }
  });
};
