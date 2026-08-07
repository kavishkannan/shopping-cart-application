import { Request, Response, NextFunction } from "express";
import CartService from "../services/cart.service";
import { ApiResponse } from "../utils/apiResponse";
import { STATUS_CODES } from "../constants/statusCodes";

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

      const cart = await CartService.getCart(userId);

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Cart fetched successfully", cart));
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;

      const userId = (req as any).user.id;

      await CartService.addToCart(userId, productId, quantity);

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          ApiResponse.success(
            "Product added to cart",
            null,
            STATUS_CODES.CREATED,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body;

      await CartService.updateQuantity(Number(req.params.id), quantity);

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Cart updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      await CartService.removeItem(Number(req.params.id));

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Item removed successfully"));
    } catch (error) {
      next(error);
    }
  }

  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      
      await CartService.placeOrder(userId);

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Order placed successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
