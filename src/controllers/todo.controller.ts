import type { Request, Response } from "express";
import pool from "../config/db.js";

export const todoController = {
  get: async (req: Request, res: Response) => {
    try {
      const { search = "", page = 1, limit = 5 } = req.query;
      const numPage = Number(page);
      const numLimit = Number(limit);
      if (isNaN(numPage) || isNaN(numLimit))
        return res
          .status(400)
          .json({ success: false, message: "Page or Limit must be number" });
      if (numPage <= 0 || numLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: "Page and Limit must be positive numbers",
        });
      }
      const values = [`%${search}%`, numLimit, (numPage - 1) * numLimit];
      const [countRes, dataRes] = await Promise.all([
        pool.query(
          `
          SELECT COUNT(*) FROM todo 
          WHERE title ILIKE $1`,
          [values[0]],
        ),
        pool.query(
          `
          SELECT * FROM todo 
          WHERE title ILIKE $1 
          ORDER BY id 
          LIMIT $2 OFFSET $3
          `,
          values,
        ),
      ]);
      res.status(200).json({
        success: true,
        meta: {
          total_todos: Number(countRes.rows[0].count),
          total_pages: Math.ceil(parseInt(countRes.rows[0].count) / numLimit),
          todos_per_page: numLimit,
          current_page: numPage
        },
        data: dataRes.rows,
      });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const numId = Number(id);
      if (isNaN(numId))
        return res
          .status(400)
          .json({ success: false, message: "Id must be number" });
      const response = await pool.query(
        `
      SELECT * FROM todo
      WHERE id = $1
      `,
        [numId],
      );
      if (response.rows.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });
      res.status(200).json({ success: true, data: response.rows[0] });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;

      if (!title || typeof title !== "string" || !title.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Title wajib diisi" });
      }

      const newTodo = await pool.query(
        `
        INSERT INTO todo (title)
        VALUES($1)
        RETURNING *
        `,
        [title],
      );
      res.status(201).json({ success: true, data: newTodo.rows[0] });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, isCompleted } = req.body;
      if (!title || typeof title !== "string" || !title.trim())
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      if (typeof isCompleted !== "boolean")
        return res
          .status(400)
          .json({ success: false, message: "isCompleted must be boolean" });
      const numId = Number(id);
      if (isNaN(numId)) {
        return res
          .status(400)
          .json({ success: false, message: "ID tidak valid" });
      }
      const updatedRes = await pool.query(
        `
      UPDATE todo
      SET title = $1, is_completed = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
        [title, isCompleted, numId],
      );
      if (updatedRes.rowCount === 0)
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });
      res.status(200).json({ success: true, data: updatedRes.rows[0] });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const numId = Number(id);

      if (isNaN(numId)) {
        return res
          .status(400)
          .json({ success: false, message: "ID tidak valid" });
      }

      const deletedRes = await pool.query(
        `
        DELETE FROM todo
        WHERE id = $1
        `,
        [numId],
      );

      if (deletedRes.rowCount === 0)
        return res
          .status(404)
          .json({ success: false, message: "Todo not found" });

      res
        .status(200)
        .json({ success: true, message: "Deleted todo successfully" });
    } catch (error: any) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};
