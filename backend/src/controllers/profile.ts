import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import authorization from "../middlewares/authorization";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import bcrypt from "bcrypt";

const saltRounds = 10;
const profileRouter = Router();
const prisma = new PrismaClient();

profileRouter.get("/posts", authorization, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
            id: true,
          },
        },
      },
    });

    if (posts === null) {
      throw new BadRequestError();
    }

    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

profileRouter.put("/", authorization, async (req, res, next) => {
  try {
    const { userId, username, email, newPassword, currentPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      user === null ||
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      throw new UnauthorizedError();
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        email,
        password: passwordHash,
      },
      include: {
        posts: true,
      },
    });

    const { password: _, ...results } = updatedUser;
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

profileRouter.delete("/", authorization, async (req, res, next) => {
  try {
    const { userId, password, email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      user === null ||
      email !== user.email ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new UnauthorizedError();
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: user.id,
      },
      include: {
        posts: true,
      },
    });

    const { password: _, ...results } = deletedUser;
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

export default profileRouter;
