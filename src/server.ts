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

const getTodos = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));

app.get("/todos", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "Database file missing" });
    res.status(200).json({ success: true, data: getTodos() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/todos/:id", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataPath))
      return res
        .status(500)
        .json({ success: false, message: "Database file missing" });
    const { id } = req.params;
    const todos = getTodos();
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    const existingTodo = todos.find((todo: any) => todo.id === Number(id));
    if (!existingTodo)
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    res.status(200).json({ success: true, data: existingTodo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/todos", (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });

    const todos = getTodos();
    const newId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;

    const newTodo = {
      id: newId,
      title: title,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    todos.push(newTodo);
    fs.writeFileSync(dataPath, JSON.stringify(todos));

    res.status(201).json({ success: true, data: newTodo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/todos/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    if (!title.trim())
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    const todos = getTodos();
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    const index = todos.findIndex((t: any) => t.id === Number(id));
    if (index === -1)
      return res.status(404).json({ success: false, message: "Not found" });
    todos[index] = {
      ...todos[index],
      title: title ?? todos[index].title,
      isCompleted: isCompleted ?? todos[index].isCompleted,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(dataPath, JSON.stringify(todos));
    res.status(200).json({ success: true, data: todos[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todos = getTodos();
    if (isNaN(Number(id)))
      return res.status(400).json({ success: false, message: "Bad request" });
    const newTodos = todos.filter((t: any) => t.id !== Number(id));

    if (todos.length === newTodos.length)
      return res.status(404).json({ success: false, message: "Not found" });

    fs.writeFileSync(dataPath, JSON.stringify(newTodos, null, 2));
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log("Server ready on port:", PORT));
