import { stdout } from "process";
import { EOL } from "os";
import { cwd } from "process";

export const logCurrentPath = () => {
  const path = cwd();

  const log = `You are currently in ${path}${EOL}`;

  stdout.write(log);
};
