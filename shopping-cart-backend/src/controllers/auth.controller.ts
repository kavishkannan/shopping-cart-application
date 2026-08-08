import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { STATUS_CODES } from "../constants/statusCodes";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      return res
        .status(STATUS_CODES.CREATED)
        .json(
          ApiResponse.success(
            "User registered successfully",
            user,
            STATUS_CODES.CREATED,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return res
        .status(STATUS_CODES.OK)
        .json(ApiResponse.success("Login successful", result));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
