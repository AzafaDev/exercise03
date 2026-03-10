import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const newUser = await authService.register(name, email, password);
      res.status(201).json({
        success: true,
        data: {
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await authService.login(email, password);
      res
        .status(200)
        .json({ success: true, message: `Welcome back, ${existingUser.name}` });
    } catch (error) {
      next(error);
    }
  },
};
