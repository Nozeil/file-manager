import { argv } from "process";

export const getUsername = () => {
  const arg = argv.slice(2).find((arg) => arg.startsWith("--username"));
  const equalsIndex = arg.indexOf("=") + 1;
  const username = arg.slice(equalsIndex);

  return username;
};
