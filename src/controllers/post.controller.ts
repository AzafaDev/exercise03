import { Request, Response } from "express";
import { postService } from "../services/post.service";

export const postController = {
  getPosts: async (req: Request, res: Response) => {
    const posts = await postService.getPosts();
    res.status(200).json({ success: true, data: posts });
  },
  getPostById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const existingPost = await postService.getPostById(id as string);
    res.status(200).json({ success: true, data: existingPost });
  },
  createPost: async (req: Request, res: Response) => {
    const { content, image, authorId } = req.body;
    const newPost = await postService.createPost(content, image, authorId);
    res.status(201).json({ success: true, data: newPost });
  },
  updatePost: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, image, authorId } = req.body;
    const updatedPost = await postService.updatePost(
      id as string,
      content,
      image,
      authorId,
    );
    res.status(200).json({ success: true, data: updatedPost });
  },
};
