import { OperationFailedError } from "../errors/operationFailed.js";

export const asyncCommandExecutor = async (command) => {
  try {
    await command();
  } catch {
    throw new OperationFailedError();
  }
};