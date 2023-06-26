import { getDirname } from "./getDirname.js";
import { sep } from "path";

export const getInitialPath = () => {
  const __dirname = getDirname(import.meta.url);

  return __dirname.split(sep).slice(0, 3).join(sep);
};
