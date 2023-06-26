import { argv } from "process";
import { InvalidInputError } from "../errors/invalidInput.js";

export const getUsername = () => {
  if (argv.length !== 3) {
    throw new InvalidInputError();
  }

  const arg = argv.at(-1);
  const isValidArg = arg.startsWith("--username=");

  if (isValidArg) {
    const equalsIndex = arg.indexOf("=") + 1;
    const username = arg.slice(equalsIndex) || "Anonymous";
    return username;
  } else {
    throw new InvalidInputError();
  }
};
