import { Request, Response } from "express";
import { userSchema } from "../validation/loginSchema";
import { comparePassword, hashPassword } from "../utils";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_PASSWORD = process.env.JWT_PASSWORD || "password";

export const signup = async (req: Request, res: Response) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: "Invalid Entry"
        });
        return;
    }
    const { email, password } = validation.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400).json({
            message: "Email already exists",
        });
        return;
    }

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
        res.status(400).json({ message: "internal server error" });
        return;
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: validation.data.email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "user registered",
            userId: user.id,
        });
    } catch (e: any) {
        res.status(400).json({
            message: e.message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(404).json({
            message: "Incorrect Details",
        });
        return;
    }
    const { email, password } = validation.data;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const valid = await comparePassword(password, user.password);
        if (!valid) {
            res.status(404).json({
                mes: "Incorrect password",
            });
            return;
        }
        const payload = { userId: user.id };
        const token = jwt.sign(payload, JWT_PASSWORD);
        res.status(200).json({ token, 
            user:{
                id: user.id,
                email: user.email
            } ,
        });
    } catch (e) {
        res.status(400).json({
            message: "Internal Error",
        });
    }
};



export const validateToken = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: {
        id: true,
        email: true,
      },
    })

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json({ user: user })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
