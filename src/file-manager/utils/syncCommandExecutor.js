import { OperationFailedError } from "../errors/operationFailed.js";

export const syncCommandExecutor = (command) => {
  try {
    command();
  } catch {
    throw new OperationFailedError();
  }
};
