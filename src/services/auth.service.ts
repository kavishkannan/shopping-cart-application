import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/statusCodes";

import AuthRepository from "../repositories/auth.repository";

import { IUser, ILogin } from "../interfaces/user.interface";
import dotenv from "dotenv";

dotenv.config();

class AuthService {
  async register(user: IUser) {
    const existingUser = await AuthRepository.findByEmail(user.email);

    if (existingUser) {
      throw {
        statusCode: STATUS_CODES.CONFLICT,
        message: "User already exists",
      };
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.role = user.role ?? "CUSTOMER";
    const userId = await AuthRepository.create(user);
    return {
      id: userId,
      name: user.name,
      email: user.email,
    };
  }

  async login(loginData: ILogin) {
    const user = await AuthRepository.findByEmail(loginData.email);
    if (!user) {
      throw {
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Invalid email or password",
      };
    }
    const isPasswordMatched = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw {
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Invalid email or password",
      };
    }
    const SecretKey: string = process.env.JWT_SECRET ?? "";

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SecretKey,
      {
        expiresIn: "1d",
      },
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export default new AuthService();
