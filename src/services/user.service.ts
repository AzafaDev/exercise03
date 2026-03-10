import { prisma } from "../lib/prisma";

export const userService = {
  getUsers: async () => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
      },
    });
    return users;
  },
  getuserById: async (id: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });
    if (!existingUser) throw new Error("User not found");
    return existingUser;
  },
  updateUser: async (
    id: string,
    name: string,
    email: string,
    password: string,
  ) => {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) throw new Error("User not found");
    if (!name || !email || !password)
      throw new Error("All fields are required");
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
      },
    });
    return updatedUser;
  },
  getPost: async (id: string) => {
    const author = await prisma.user.findUnique({
      where: { id },
    });
    if (!author) throw new Error("User not found");
    const posts = await prisma.post.findMany({
      where: {
        author,
      },
      select:{
        content: true,
        image: true, 
      }
    });
    return posts
  },
};
