const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(userData) {
  const { username, email, password } = userData;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
        email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // Don't return password
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  });

  if(!user) {
    throw new Error("Invalid email or password")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    throw new Error("Invalid email or password")
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  return {
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};