import express from "express";
import cors from "cors";
import postsRouter from "./routes/Post";
import commentsRouter from "./routes/Comment";
import usersRouter from "./routes/User";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

export default app;
