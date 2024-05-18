"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationRules = exports.registerValidationRules = void 0;
const express_validator_1 = require("express-validator");
//validation for registration
const registerValidationRules = () => {
    return [
        (0, express_validator_1.body)("fullname").notEmpty().withMessage("Fullname is required"),
        (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
        (0, express_validator_1.body)("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ];
};
exports.registerValidationRules = registerValidationRules;
// Validation for login request
const loginValidationRules = () => [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.loginValidationRules = loginValidationRules;
