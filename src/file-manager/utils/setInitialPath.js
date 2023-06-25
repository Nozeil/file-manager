import { chdir } from "process";
import { getInitialPath } from "./getInitialPath.js";

export const setInitialPath = () => {
  const initialPath = getInitialPath();
  chdir(initialPath);
};
