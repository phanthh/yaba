export class UnauthorizedError extends Error {
  constructor(...params: any[]) {
    super(...params);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends Error {
  constructor(...params: any[]) {
    super(...params);
    this.name = "BadRequestError";
  }
}
