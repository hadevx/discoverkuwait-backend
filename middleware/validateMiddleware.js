const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone number must be exactly 8 digits"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

const addressValidation = [
  body("governorate").notEmpty().withMessage("Governorate is required"),

  body("city").notEmpty().withMessage("City is required"),

  body("block")
    .trim()
    .notEmpty()
    .withMessage("Block is required")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("Block can only contain letters, numbers, spaces, and dashes"),

  // street (allow letters, numbers, spaces)
  body("street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("Street can only contain letters, numbers, spaces, and dashes"),

  // house (can be numeric or alphanumeric like "10" or "10B")
  body("house")
    .trim()
    .notEmpty()
    .withMessage("House is required")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("House can only contain letters, numbers, spaces, and dashes"),
];

module.exports = { registerValidation, loginValidation, addressValidation };
