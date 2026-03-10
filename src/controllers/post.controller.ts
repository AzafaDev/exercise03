import { NextFunction, Request, Response } from "express";
import { postService } from "../services/post.service";

export const postController = {
  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await postService.getPosts();
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  },
  getPostById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const existingPost = await postService.getPostById(id as string);
      res.status(200).json({ success: true, data: existingPost });
    } catch (error) {
      next(error);
    }
  },
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, image, authorId } = req.body;
      const newPost = await postService.createPost(content, image, authorId);
      res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      next(error);
    }
  },
  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { content, image } = req.body;
      const updatedPost = await postService.updatePost(
        id as string,
        content,
        image,
      );
      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      next(error);
    }
  },
};
