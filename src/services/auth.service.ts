import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("Email already registered");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return newUser;
  },
  login: async (email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) throw new Error("User not found");
    const isMatchingPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isMatchingPassword) throw new Error("Invalid password");
    return existingUser;
  },
};
