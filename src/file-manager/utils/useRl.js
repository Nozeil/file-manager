import readline from "readline/promises";
import { logCurrentPath } from "./logCurrentPath.js";
import { cwd, stdin as input, stdout as output } from "process";
import { logWithUsername } from "./logWithUsername.js";
import { logGoodbye } from "./logGoodbye.js";
import { chdir } from "process";
import { open, readFile, readdir, rename, unlink } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { isAbsolute, resolve } from "path";
import { EOL, arch, cpus, homedir, userInfo } from "os";
import util from "util";
import { createHash } from "crypto";

class OperationFaildError extends Error {
  constructor() {
    super();
    this.message = "Operation failed";
  }
}

class InvalidInputError extends Error {
  constructor() {
    super();
    this.message = "Invalid input";
  }
}

const syncCommandExecutor = (command) => {
  try {
    command();
  } catch (e) {
    throw new OperationFaildError();
  }
};

const asyncCommandExecutor = async (command) => {
  try {
    await command();
  } catch {
    throw new OperationFaildError();
  }
};

const createPathFromEnteredPath = (enteredPath) => {
  return isAbsolute(enteredPath) ? enteredPath : resolve(cwd(), enteredPath);
};

const COMMANDS = {
  [".exit"](close) {
    logWithUsername(logGoodbye);
    close();
  },

  up() {
    chdir("..");
  },

  cd(path) {
    chdir(path);
  },

  async ls() {
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
  },

  async cat(enteredPath) {
    let path = createPathFromEnteredPath(enteredPath);
    const rs = createReadStream(path);

    await pipeline(rs, output, { end: false });
    output.write(`${EOL}`);
  },

  async add(fileName) {
    const path = resolve(cwd(), fileName);
    await open(path, "ax");
  },

  async rn(enteredOldPath, enteredNewPath) {
    const oldPath = createPathFromEnteredPath(enteredOldPath);
    const newPath = createPathFromEnteredPath(enteredNewPath);

    await rename(oldPath, newPath);
  },

  async cp(enteredPathToFile, enteredPathToDirectory) {
    const pathToFile = createPathFromEnteredPath(enteredPathToFile);
    const fileName = pathToFile.split(/^.*[\\\/]/).at(-1);

    const pathToCopy = resolve(
      createPathFromEnteredPath(enteredPathToDirectory),
      fileName
    );

    const rs = createReadStream(pathToFile);
    const ws = createWriteStream(pathToCopy);

    await pipeline(rs, ws);
  },

  async rm(enteredPath) {
    const path = createPathFromEnteredPath(enteredPath);

    await unlink(path);
  },

  async mv(enteredPathToFile, enteredPathToDirectory) {
    await this.cp(enteredPathToFile, enteredPathToDirectory);
    await this.rm(enteredPathToFile);
  },

  os: {
    "--EOL"() {
      output.write(`EOL:${EOL}`);
    },
    "--cpus"() {
      const filteredCpus = cpus().reduce((acc, curr) => {
        const result = {
          model: curr.model.trim(),
          speed: `${curr.speed / 1000} GHz`,
        };
        acc.push(result);
        return acc;
      }, []);
      const coresAmount = filteredCpus.length;
      const result = `CPUs amount: ${coresAmount}${EOL}CPUs info: ${util.inspect(
        filteredCpus
      )}${EOL}`;
      output.write(result);
    },
    "--homedir"() {
      output.write(homedir() + EOL);
    },
    "--username"() {
      output.write(userInfo().username + EOL);
    },
    "--architecture"() {
      output.write(arch() + EOL);
    },
  },

  async hash(enteredPath) {
    const path = createPathFromEnteredPath(enteredPath);
    const data = await readFile(path);
    const hash = createHash("sha256").update(data).digest("hex");

    output.write(hash + EOL);
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
    const enteredCommand = splitedLine[0];
    const command = COMMANDS[enteredCommand];

    try {
      switch (enteredCommand) {
        case ".exit": {
          if (splitedLine.length > 1) {
            throw new InvalidInputError();
          }

          syncCommandExecutor(() => command(close));
          break;
        }
        case "up": {
          if (splitedLine.length > 1) {
            throw new InvalidInputError();
          }

          syncCommandExecutor(() => command());
          break;
        }
        case "cd": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const path = splitedLine[1];
          syncCommandExecutor(() => command(path));
          break;
        }
        case "ls": {
          if (splitedLine.length > 1) {
            throw new InvalidInputError();
          }

          await asyncCommandExecutor(async () => await command());
          break;
        }
        case "cat": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const path = splitedLine[1];
          await asyncCommandExecutor(async () => await command(path));
          break;
        }
        case "add": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const fileName = splitedLine[1];
          await asyncCommandExecutor(async () => await command(fileName));
          break;
        }
        case "rn": {
          if (splitedLine.length > 3) {
            throw new InvalidInputError();
          }

          const oldPath = splitedLine[1];
          const newPath = splitedLine[2];

          await asyncCommandExecutor(
            async () => await command(oldPath, newPath)
          );
          break;
        }
        case "cp": {
          if (splitedLine.length > 3) {
            throw new InvalidInputError();
          }

          const pathToFile = splitedLine[1];
          const pathToDirectory = splitedLine[2];

          await asyncCommandExecutor(
            async () => await command(pathToFile, pathToDirectory)
          );
          break;
        }
        case "rm": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const enteredPath = splitedLine[1];
          await asyncCommandExecutor(async () => await command(enteredPath));
          break;
        }
        case "mv": {
          if (splitedLine.length > 3) {
            throw new InvalidInputError();
          }

          const pathToFile = splitedLine[1];
          const pathToDirectory = splitedLine[2];

          await asyncCommandExecutor(
            async () =>
              await COMMANDS[enteredCommand](pathToFile, pathToDirectory)
          );
          break;
        }
        case "os": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const arg = splitedLine[1];
          syncCommandExecutor(() => command[arg]());
          break;
        }
        case "hash": {
          if (splitedLine.length > 2) {
            throw new InvalidInputError();
          }

          const enteredPath = splitedLine[1];
          await asyncCommandExecutor(async () => await command(enteredPath));
          break;
        }
        default: {
          throw new InvalidInputError();
        }
      }
    } catch (error) {
      console.error(error.message);

      if (enteredCommand === ".exit") {
        logCurrentPath();
      }
    }

    if (enteredCommand !== ".exit") {
      logCurrentPath();
    }
  });
};
