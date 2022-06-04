import { date, InferType, number, object, string } from "yup";

export const userSchema = object({
  id: number().required(),
  username: string().required(),
  email: string().email().required(),
});

export type User = InferType<typeof userSchema>;

export const postSchema = object({
  id: number().integer().positive().required(),
  createdAt: date().required(),
  updatedAt: date(),
  title: string().required(),
  content: string().required(),
  authorId: number().integer().positive().required(),
  author: userSchema.required(),
});

export type Post = InferType<typeof postSchema>;
