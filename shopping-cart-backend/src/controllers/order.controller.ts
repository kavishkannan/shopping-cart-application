import { Request, Response, NextFunction } from "express";

import OrderService from "../services/order.service";
import { ApiResponse } from "../utils/apiResponse";
import { STATUS_CODES } from "../constants/statusCodes";

class OrderController {
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      
      const orders = await OrderService.getOrders(userId);

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Orders fetched successfully", orders));
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getAllOrders();
      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("All orders fetched successfully", orders));
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
