export class OperationFailedError extends Error {
  constructor() {
    super();
    this.message = "Operation failed";
  }
}