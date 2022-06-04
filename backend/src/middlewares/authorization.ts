import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { getEnv } from "../utils/getEnv";
import { Payload } from "../utils/types";

const prisma = new PrismaClient();

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7, authHeader.length);
      const payload = jwt.verify(token, getEnv("SECRET")) as Payload;

      if (payload.id) {
        const token = await prisma.token.findUnique({
          where: {
            userId: Number(payload.id),
          },
        });

        if (token?.valid && token.expiration > new Date()) {
          req.body.userId = token.userId;
          return next();
        }
      }
    }
    throw new UnauthorizedError();
  } catch (error) {
    next(error);
  }
};

export default authorization;
