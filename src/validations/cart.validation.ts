import { body } from "express-validator";

export const cartValidation = [
  body("productId").isInt({ min: 1 }).withMessage("Product Id is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity should be greater than zero"),
];
