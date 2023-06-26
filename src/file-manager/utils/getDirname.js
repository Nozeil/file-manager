import { fileURLToPath } from "url";
import { dirname } from "path";

export const getDirname = (url) => {
  const filename = fileURLToPath(url);
  return dirname(filename);
};