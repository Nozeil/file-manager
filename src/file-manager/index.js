import { logWithUsername } from "./utils/logWithUsername.js";
import { logGreeting } from "./utils/logGreeting.js";
import { logCurrentPath } from "./utils/logCurrentPath.js";
import { useRl } from "./utils/useRl.js";
import { setInitialPath } from "./utils/setInitialPath.js";

const start = async () => {
  try {
    logWithUsername(logGreeting);
    setInitialPath();

    logCurrentPath();

    await useRl();
  } catch (e) {
    console.error(e.message);
  }
};

await start();
