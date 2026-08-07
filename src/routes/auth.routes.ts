import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation";
import { validateMiddleware } from "../middlewares/validate.middleware";

const router = Router();

router.post(
  "/register",
  registerValidation,
  validateMiddleware,
  AuthController.register,
);

router.post(
  "/login",
  loginValidation,
  validateMiddleware,
  AuthController.login,
);

export default router;
