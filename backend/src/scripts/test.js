require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "sameer@example.com",
    },
    update: {},
    create: {
      username: "sameer",
      email: "sameer@example.com",
      password: "secret123",
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "Learn Prisma",
      content: "Understanding migrations and relationships",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  
  const userWithNotes = await prisma.user.findUnique({
    where: {
        email: "sameer@example.com",
    },
    include: {
        notes: true,
    },
  });

  console.log(JSON.stringify(userWithNotes, null, 2));
  console.log("Created Note:");
  console.log(note);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });