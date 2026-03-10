import { prisma } from "../lib/prisma";

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("Email already registered");
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return newUser;
  },
  login: async (email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) throw new Error("User not found");
    if (existingUser.password !== password) throw new Error("Invalid password");
    return existingUser
  },
};
