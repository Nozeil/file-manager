import readline from "readline/promises";
import { logCurrentPath } from "./logCurrentPath.js";
import { cwd, stdin as input, stdout as output } from "process";
import { logWithUsername } from "./logWithUsername.js";
import { logGoodbye } from "./logGoodbye.js";
import { chdir } from "process";
import { readdir } from "fs/promises";

const COMMANDS = {
  [".exit"](close) {
    logWithUsername(logGoodbye);
    close();
  },
  up() {
    try {
      chdir("..");
    } catch {
      throw new Error("Operation failed");
    }
  },
  cd(path) {
    try {
      chdir(path);
    } catch {
      throw new Error("Operation failed");
    }
  },
  async ls() {
    try {
      const files = await readdir(cwd(), { withFileTypes: true });
      const table = files
        .map((file) => ({
          Name: file.name,
          Type: file.isDirectory() ? "directory" : "file",
        }))
        .sort((a, b) => {
          if (a.Type === b.Type) {
            return 0;
          } else if (a.Type === "directory" && b.Type === "file") {
            return -1;
          } else if (a.Type === "file" && b.Type === "directory") {
            return 1;
          }
        });
      console.table(table);
    } catch {
      throw new Error("Operation failed");
    }
  },
};

export const useRl = async () => {
  const rl = readline.createInterface({
    input,
    output,
  });
  const close = () => rl.close();

  rl.on("SIGINT", () => {
    COMMANDS[".exit"](close);
  });

  rl.on("line", async (line) => {
    const splitedLine = line.split(/ +(?=(?:"[^"]*"|[^"])*$)/);
    const firstCommand = splitedLine[0];
    const command = COMMANDS[firstCommand];
    console.log(splitedLine);

    if (command) {
      try {
        switch (firstCommand) {
          case ".exit": {
            if (splitedLine.length > 1) {
              throw new Error("Invalid input");
            }
            command(close);
            break;
          }
          case "up": {
            if (splitedLine.length > 1) {
              throw new Error("Invalid input");
            }
            command();
            break;
          }
          case "cd": {
            if (splitedLine.length > 2) {
              throw new Error("Invalid input");
            }
            const path = splitedLine[1];
            command(path);
            break;
          }
          case "ls": {
            if (splitedLine.length > 1) {
              throw new Error("Invalid input");
            }
            await command();
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
      console.error("Invalid input");
    }

    if (firstCommand !== ".exit") {
      logCurrentPath();
    }
  });
};
