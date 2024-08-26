import { handleError } from "../../utils/errorHandler.js";
import prisma from "./../../../prisma/Config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; 
export const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!findUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: findUser.id, username: findUser.username },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    const {
      password: _,
      otp: __,
      token: ___,
      ...userWithoutSensitiveData
    } = findUser;

    if (!findUser.token) {
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          token: token,
          status: true,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          status: true,
        },
      });
    }

    return res.status(200).json({
      message: "Login successful",
      data: {
        user: userWithoutSensitiveData,
        token: findUser.token,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};
export const handleRegister = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const findUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (findUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const createUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    return res
      .status(200)
      .json({ message: "User created successfully", data: createUser });
  } catch (error) {
    handleError(res, error);
  }
};

export const checkLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "not login" });
  }
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        token: token,
      },
      select: {
        id: true,
        email: true,
        username: true,
        token: true,
        status: true,
        role: true,
      },
    
    });

    if (!findUser) {
      return res.status(401).json({ message: "not login" });
    }

    return res.status(200).json({ data: findUser });
  } catch (error) {
    handleError(res, error);
  }
};
