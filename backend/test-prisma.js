require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

console.log("PrismaClient type:", typeof PrismaClient);

try {
  const prisma = new PrismaClient({});
  console.log("Client created successfully");
} catch (err) {
  console.error(err);
}

