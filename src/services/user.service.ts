import { prisma } from "../lib/prisma";

export const userService = {
  getUsers: async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  },
  getuserById: async (id: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
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
    const nameFix = name || existingUser.name;
    const emailFix = email || existingUser.email;
    const passwordFix = password || existingUser.password;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: nameFix,
        email: emailFix,
        password: passwordFix,
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
        authorId: author.id,
      },
      select: { id: true, content: true, image: true },
    });
    return posts;
  },
};
