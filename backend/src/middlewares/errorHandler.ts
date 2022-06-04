import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/errors";

const errorHandler = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  if (error instanceof JsonWebTokenError) {
    return res.status(400).json({ error: "bad token" });
  } else if (error instanceof UnauthorizedError) {
    return res.status(400).json({ error: error.message || "unauthorized" });
  } else if (error instanceof BadRequestError) {
    return res.status(400).json({ error: error.message || "bad request" });
  }

  next(error);
};

export default errorHandler;
