import { NextFunction, Request, Response } from "express";
import jwt, { Jwt } from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload } from "../interface";
dotenv.config();

const JWT_PASSWORD = process.env.JWT_PASSWORD as string ||  "password"


export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.header("authorization");
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(403).json({
            message: "Invalid token",
        });
        return;
    }

    jwt.verify(token, JWT_PASSWORD, (err, decoded) => {
        const payload = decoded as JwtPayload;
        if (err) {
            res.status(403).json({ message: err });
            return;
        }
        (req as any).userId = payload.userId;
        next();
    });
};
