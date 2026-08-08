import { Router } from "express";
import CartController from "../controllers/cart.controller";
import { cartValidation } from "../validations/cart.validation";
import { validateMiddleware } from "../middlewares/validate.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, CartController.getCart);

router.post(
  "/items",
  authMiddleware,
  cartValidation,
  validateMiddleware,
  CartController.addToCart,
);

router.put(
  "/items/:id",
  authMiddleware,
  validateMiddleware,
  CartController.updateQuantity,
);

router.delete("/items/:id", authMiddleware, CartController.removeItem);

router.post("/place-order", authMiddleware, CartController.placeOrder);
router.delete(
  "/remove-cart/:productId",
  authMiddleware,
  CartController.removeItemByProduct,
);

export default router;
