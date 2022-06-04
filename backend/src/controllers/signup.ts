import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { BadRequestError } from "../utils/errors";

const saltRounds = 10;
const signupRouter = Router();
const prisma = new PrismaClient();

type RequestBody = {
  email: string;
  username: string;
  password: string;
};

signupRouter.post("/", async (req, res, next) => {
  try {
    const { email, username, password } = req.body as RequestBody;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user !== null) {
      throw new BadRequestError(`user with email ${email} already exists`);
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
    });
    const { password: _, ...results } = newUser;
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
});

export default signupRouter;
