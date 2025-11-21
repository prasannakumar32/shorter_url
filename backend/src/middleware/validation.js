const { body, validationResult } = require('express-validator');

const validateUrl = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const urlValidation = [
  body('url')
    .isURL({ require_protocol: true })
    .withMessage('Please provide a valid URL with protocol (http/https)'),
  validateUrl
];

const validateCustomCode = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const customCodeValidation = [
  body('customCode')
    .optional()
    .isAlphanumeric()
    .isLength({ min: 3, max: 20 })
    .withMessage('Custom code must be alphanumeric and 3-20 characters long'),
  validateCustomCode
];

module.exports = {
  validateUrl: urlValidation,
  validateCustomCode: customCodeValidation,
};