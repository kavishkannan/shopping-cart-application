import { Request, Response, NextFunction } from "express";

import OrderService from "../services/order.service";
import { ApiResponse } from "../utils/apiResponse";
import { STATUS_CODES } from "../constants/statusCodes";

class OrderController {
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = 10;
      const search = String(req.query.search || "");
      const Result = await OrderService.getUserOrders(
        userId,
        page,
        limit,
        search,
      );

      return res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK,
        data: Result.rows,
        pagination: {
          page,
          limit,
          total: Result.total,
          totalPages: Math.ceil(Result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = 10;
      const search = String(req.query.search || "");
      const Result = await OrderService.getAllOrders(page, limit, search);
      return res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK,
        data: Result.rows,
        pagination: {
          page,
          limit,
          total: Result.total,
          totalPages: Math.ceil(Result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
