import express, { NextFunction, Response } from "express";
import { Request } from "express";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import postRouter from "./routers/post.router";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
