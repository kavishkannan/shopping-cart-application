import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/statusCodes";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw {
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Authorization token is required",
      };
    }

    const token = authHeader.split(" ")[1];

    const SecretKey: string = process.env.JWT_SECRET ?? "";

    const decoded = jwt.verify(token, SecretKey);

    (req as any).user = decoded;

    next();
  } catch (error) {
    next({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
