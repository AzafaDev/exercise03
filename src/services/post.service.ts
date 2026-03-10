import { prisma } from "../lib/prisma";

export const postService = {
  getPosts: async () => {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        image: true,
      },
    });
    return posts;
  },
  getPostById: async (id: string) => {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: {
        content: true,
        image: true,
      },
    });
    if (!existingPost) throw new Error("Post not found");
    return existingPost;
  },
  createPost: async (content: string, image: string, authorId: string) => {
    const existingAuthor = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!existingAuthor) throw new Error("Author not found");
    if (!content || !image) throw new Error("All fields are required");
    const newPost = await prisma.post.create({
      data: {
        content,
        image,
        authorId,
      },
      select: {
        content: true,
        image: true,
      },
    });
    return newPost;
  },
  updatePost: async (
    id: string,
    content: string,
    image: string,
    authorId: string,
  ) => {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new Error("Post not found");
    const contentFix = content || existingPost.content;
    const imageFix = image || existingPost.image;
    const authorIdFix = authorId || existingPost.authorId;
    const existingAuthor = await prisma.user.findUnique({
      where: { id: authorIdFix },
    });
    if (!existingAuthor) throw new Error("Author does not exist");
    const updatedPost = await prisma.post.update({
      where: { id },
      data:{
        content: contentFix,
        image: imageFix,
        authorId: authorIdFix
      },
      select:{
        content:true,
        image:true
      }
    });
    return updatedPost
  },
};
