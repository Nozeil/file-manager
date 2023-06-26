import { EOL } from "os";
import { stdout } from "process";

export const logGreeting = (username) => {
  const greeting = `Welcome to the File Manager, ${username}!${EOL}`;

  stdout.write(greeting);
};
