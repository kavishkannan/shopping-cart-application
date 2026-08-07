import { body } from "express-validator";

export const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price should be greater than zero"),

  body("stock").isInt({ min: 0 }).withMessage("Stock cannot be negative"),
  
  body("image_url").trim().notEmpty().withMessage("Image URL is required"),
];
