import { stdout } from "process";
import { EOL } from "os";

export const logGoodbye = (username) => {
  const goodbye = `${EOL}Thank you for using File Manager, ${username}, goodbye!`;

  stdout.write(goodbye);
};
