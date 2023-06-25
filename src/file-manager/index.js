import { logWithUsername } from "./utils/logWithUsername.js";
import { logGreeting } from "./utils/logGreeting.js";
import { logCurrentPath } from "./utils/logCurrentPath.js";
import { useRl } from "./utils/useRl.js";
import { setInitialPath } from "./utils/setInitialPath.js";

const start = () => {
  logWithUsername(logGreeting);
  setInitialPath();

  logCurrentPath();

  useRl();
};

start();
