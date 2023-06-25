import { stdout } from "process";

export const logGoodbye = (username) => {
  const goodbye = `Thank you for using File Manager, ${username}, goodbye!`;

  stdout.write(goodbye);
};
