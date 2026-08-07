import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/statusCodes";

const roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return next({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied",
      });
    }

    next();
  };
};

export default roleMiddleware;
