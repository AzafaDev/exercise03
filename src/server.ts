import express, { type Request, type Response } from "express";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "db", "todos.json");

app.use(express.json());

app.get("/todos", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    const todos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.status(200).json({
      success: true,
      message: "Got all todos successfully!",
      data: todos,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/todos/:id", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    const { id } = req.params;
    const todos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    const foundTodo = todos.find((todo: any) => todo.id === Number(id));
    if (!foundTodo)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    res.status(200).json({
      success: true,
      message: "Got todo by id successfully!",
      data: foundTodo,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/todos", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    const { name } = req.body;
    if (!name.trim())
      return res.status(400).json({
        success: false,
        message: "name is required!",
      });
    const todos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const newId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
    const newTodo = {id: newId, name}
    todos.push(newTodo)
    fs.writeFileSync(dataPath, JSON.stringify(todos));
    res.status(201).json({
      success: true,
      message: "Created todo successfully!",
      data: todos,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.put("/todos/:id", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    const { id } = req.params;
    const { name } = req.body;
    if (!name.trim())
      return res
        .status(400)
        .json({ success: false, message: "name is required!" });
    const todos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    let updatedTodo = todos.find((todo: any) => todo.id === Number(id));
    if (!updatedTodo)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    updatedTodo.name = name;
    fs.writeFileSync(dataPath, JSON.stringify(todos));
    res.status(200).json({
      success: true,
      message: "Updated todo successfully!",
      data: updatedTodo,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    const { id } = req.params;
    const todos = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    const newTodos = todos.filter((todo: any) => todo.id !== Number(id));
    if (todos.length === newTodos.length)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    fs.writeFileSync(dataPath, JSON.stringify(newTodos));
    res.status(200).json({
      success: true,
      message: "Deleted todo successfully!",
      data: newTodos,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
