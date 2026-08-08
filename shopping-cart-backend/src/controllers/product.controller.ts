import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { STATUS_CODES } from "../constants/statusCodes";
import { ApiResponse } from "../utils/apiResponse";

class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getProducts();

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Products fetched successfully", products));
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(
        Number(req.params.id),
      );

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Product fetched successfully", product));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);

      return res
        .status(STATUS_CODES.CREATED)
        .json(
          ApiResponse.success(
            "Product created successfully",
            product,
            STATUS_CODES.CREATED,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.updateProduct(Number(req.params.id), req.body);

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Product updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(Number(req.params.id));

      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Product deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
