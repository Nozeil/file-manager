import { logWithUsername } from "./logWithUsername.js";
import { logGoodbye } from "./logGoodbye.js";

export const exit = (close) => {
  logWithUsername(logGoodbye);
  close();
};
