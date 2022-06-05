import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import loginRouter from "./controllers/login";
import postRouter from "./controllers/post";
import profileRouter from "./controllers/profile";
import signupRouter from "./controllers/signup";
import errorHandler from "./middlewares/errorHandler";
import unknownEndpoint from "./middlewares/unknownEndpoint";
import { getEnv } from "./utils/getEnv";

dotenv.config();
const app = express();
const port = getEnv("PORT");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.use("/", express.static("public"));
app.use("/api/post", postRouter);
app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/profile", profileRouter);
app.use(errorHandler);
app.use(unknownEndpoint);

app.listen(port, () => {
  console.log(`[server]: Server listening at http://localhost:${port}`);
});
