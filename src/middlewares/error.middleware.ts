import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { STATUS_CODES } from "../constants/statusCodes";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  return res
    .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.error(
        error.message || "Internal Server Error",
        error.errors || null,
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
};
