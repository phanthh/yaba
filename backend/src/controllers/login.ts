import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getEnv } from "../utils/getEnv";
import { BadRequestError } from "../utils/errors";
import { Payload } from "../utils/types";

const expireTimeout = 86400; // 1 day in seconds
const loginRouter = Router();
const prisma = new PrismaClient();

loginRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user === null || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError("invalid email or password");
    }

    const { password: _, ...returnValue } = user;
    const payload: Payload = { id: user.id };

    const token = jwt.sign(payload, getEnv("SECRET"), {
      expiresIn: expireTimeout,
    });

    const expireDate = new Date(Date.now() + expireTimeout * 1000);

    await prisma.token.upsert({
      create: {
        value: token,
        expiration: expireDate,
        userId: user.id,
      },
      update: {
        value: token,
        expiration: expireDate,
      },
      where: {
        userId: user.id,
      },
    });

    res.status(201).send({ token, ...returnValue });
  } catch (error) {
    next(error);
  }
});

export default loginRouter;
