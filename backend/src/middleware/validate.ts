import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export const loginValidation = [
  check("email", "Email is required").isEmail().normalizeEmail(),
  check("password", "Password is required").exists(),
];

export const registerValidation = [
  check("firstName", "First name is required").isString(),
  check("lastName", "Last name is required").isString(),
  check("email", "Email is required").isEmail().normalizeEmail(),
  check("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
];

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  return next();
};
