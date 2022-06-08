import { PrismaClient } from "@prisma/client";
import Router from "express";
import authorization from "../middlewares/authorization";
import { BadRequestError, UnauthorizedError } from "../utils/errors";

const prisma = new PrismaClient();

const postRouter = Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
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

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
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

    if (post === null) {
      throw new BadRequestError();
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

postRouter.post("/", authorization, async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
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
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:id", authorization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (post === null) {
      throw new BadRequestError();
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedError();
    }

    const result = await prisma.post.delete({
      where: { id: Number(id) },
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

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:id", authorization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, userId } = req.body;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (post === null) {
      throw new BadRequestError();
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedError();
    }

    const result = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
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

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default postRouter;
