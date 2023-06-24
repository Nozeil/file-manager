import { logWithUsername } from "./utils/logWithUsername.js";
import { logGreeting } from "./utils/logGreeting.js";
import { logCurrentPath } from "./utils/logCurrentPath.js";
import { useRl } from "./utils/useRl.js";

export const currentPath = {
  _value: "",

  get value() {
    return this._value;
  },

  set value(value) {
    this._value = value;
  },
};

const start = () => {
  logWithUsername(logGreeting);
  logCurrentPath();

  useRl();
};

start();
