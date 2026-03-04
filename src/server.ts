import express from "express";
import todoRouter from "./routes/todo.route.js";
import pool from "./config/db.js";

const app = express();
const PORT = 8080;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Database connected at:", res.rows[0].now);
  }
});

app.use(express.json());

app.use("/todos", todoRouter);

app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
