import type { Request, Response } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, '..',"db", "todos.json");

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

const getTodos = (): Todo[] => {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const content = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(content) as Todo[];
  } catch (error) {
    console.error("Gagal membaca file:", error);
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  fs.writeFileSync(dataPath, JSON.stringify(todos));
};

export const todoController = {
  get: (req: Request, res: Response) => {
    const todos = getTodos();
    res.status(200).json({ success: true, data: todos });
  },

  getById: (req: Request, res: Response) => {
    const { id } = req.params;
    const numId = Number(id);

    if (isNaN(numId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID harus berupa angka" });
    }

    const todos = getTodos();
    const todo = todos.find((todo) => todo.id === numId);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: todo });
  },

  create: (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title wajib diisi" });
    }

    const todos = getTodos();

    const maxId = todos.reduce(
      (max, todo) => (todo.id > max ? todo.id : max),
      0,
    );

    const newTodo: Todo = {
      id: maxId + 1,
      title: title.trim(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    todos.push(newTodo);
    saveTodos(todos);

    res.status(201).json({ success: true, data: newTodo });
  },

  update: (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    const numId = Number(id);

    if (isNaN(numId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }

    const todos = getTodos();
    const index = todos.findIndex((todo) => todo.id === numId);

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Todo tidak ditemukan" });
    }

    todos[index] = {
      ...todos[index],
      title:
        title && typeof title === "string" ? title.trim() : todos[index]!.title,
      isCompleted:
        typeof isCompleted === "boolean"
          ? isCompleted
          : todos[index]!.isCompleted,
      updatedAt: new Date().toISOString(),
    } as Todo;

    saveTodos(todos);
    res.status(200).json({ success: true, data: todos[index] });
  },

  delete: (req: Request, res: Response) => {
    const { id } = req.params;
    const numId = Number(id);

    if (isNaN(numId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }

    const todos = getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== numId);

    if (todos.length === filteredTodos.length) {
      return res
        .status(404)
        .json({ success: false, message: "Todo tidak ditemukan" });
    }

    saveTodos(filteredTodos);
    res.status(200).json({ success: true, message: "Berhasil dihapus" });
  },
};
