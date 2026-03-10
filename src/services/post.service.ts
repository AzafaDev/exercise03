import { prisma } from "../lib/prisma";

export const postService = {
  getPosts: async () => {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        image: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return posts;
  },
  getPostById: async (id: string) => {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        image: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!existingPost) throw new Error("Post not found");
    return existingPost;
  },
  createPost: async (content: string, authorId: string, image?: string) => {
    const existingAuthor = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!existingAuthor) throw new Error("Author not found");
    if (!content) throw new Error("Content is required");
    const newPost = await prisma.post.create({
      data: {
        content,
        image,
        authorId,
      },
      select: {
        id: true,
        content: true,
        image: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return newPost;
  },
  updatePost: async (id: string, content: string, image?: string) => {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new Error("Post not found");
    const contentFix = content || existingPost.content;
    const imageFix = image || existingPost.image;
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content: contentFix,
        image: imageFix,
      },
      select: {
        id: true,
        content: true,
        image: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return updatedPost;
  },
};
