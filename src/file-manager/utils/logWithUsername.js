import { getUsername } from "./getUsername.js";

export const logWithUsername = (log) => {
  const username = getUsername();

  log(username);
};