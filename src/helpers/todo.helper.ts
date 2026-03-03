import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { Todo } from "../types/todo.type.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "..", "db", "todos.json");


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

export {getTodos, saveTodos}