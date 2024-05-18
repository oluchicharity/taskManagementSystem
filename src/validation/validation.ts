import { body } from "express-validator";

//validation for registration

export const registerValidationRules = () => {
  return [
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

// Validation for login request

export const loginValidationRules =()=> [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
