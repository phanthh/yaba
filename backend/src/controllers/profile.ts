import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import authorization from "../middlewares/authorization";
import { BadRequestError } from "../utils/errors";

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
        author: true,
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

export default profileRouter;
