import { Router } from "express";
import OrderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";

const router = Router();

router.get("/", authMiddleware, OrderController.getOrders);

router.get(
  "/all",
  roleMiddleware("ADMIN"),
  authMiddleware,
  OrderController.getAllOrders,
);

export default router;
