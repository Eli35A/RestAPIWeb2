import express from "express";
import cors from "cors";
import helmet from "helmet";
import postsRouter from "./routes/Post";
import commentsRouter from "./routes/Comment";
import usersRouter from "./routes/User";
import authRouter from "./routes/Auth";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter)
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

export default app;
