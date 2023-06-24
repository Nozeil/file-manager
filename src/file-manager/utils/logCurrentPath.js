import { getInitialPath } from "./getInitialPath.js";
import { stdout } from "process";
import { EOL } from "os";
import { currentPath } from "../index.js";

export const logCurrentPath = () => {
  const path = currentPath.value || getInitialPath();

  if (!currentPath.value) {
    currentPath.value = path;
  }

  const log = `You are currently in ${currentPath.value}${EOL}`;

  stdout.write(log);
};
