import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { productValidation } from "../validations/product.validation";
import { validateMiddleware } from "../middlewares/validate.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, ProductController.getProducts);

router.get("/:id", authMiddleware, ProductController.getProductById);

router.post(
  "/",
  authMiddleware,
  productValidation,
  validateMiddleware,
  ProductController.createProduct,
);

router.put(
  "/:id",
  authMiddleware,
  productValidation,
  validateMiddleware,
  ProductController.updateProduct,
);

router.delete("/:id", authMiddleware, ProductController.deleteProduct);

export default router;
