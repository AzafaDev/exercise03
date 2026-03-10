import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const userController = {
  getUsers: async (req: Request, res: Response) => {
    const users = await userService.getUsers();
    res.status(200).json({ success: true, data: users });
  },
  getuserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const existingUser = await userService.getuserById(id as string);
    return res.status(200).json({ success: true, data: existingUser });
  },
  updateUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updatedUser = await userService.updateUser(
      id as string,
      name,
      email,
      password,
    );
    res.status(200).json({ success: true, data: updatedUser });
  },
  getPost: async (req: Request, res: Response) => {
    const { id } = req.params;
    const posts = await userService.getPost(id as string);
    res.status(200).json({ success: true, data: posts });
  },
};
