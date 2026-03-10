import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: "123456",
    },
  });

  await prisma.post.createMany({
    data: [
      {
        content: "Hello world from seed",
        authorId: user.id,
      },
      {
        content: "My second post 🚀",
        authorId: user.id,
      },
      {
        content: "Learning Prisma + Express",
        authorId: user.id,
      },
      {
        content: "Building a simple social media API",
        authorId: user.id,
      },
      {
        content: "Seed data makes testing easier",
        authorId: user.id,
      },
    ],
  });

  console.log("Seed success");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());