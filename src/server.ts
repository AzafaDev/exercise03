import express from "express";
import todoRouter from "./routes/todo.route.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/todos", todoRouter);

app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
