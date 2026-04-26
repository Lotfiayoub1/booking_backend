const { body } = require('express-validator');

const createSessionValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Session name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('date_time')
    .isISO8601()
    .withMessage('date_time must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Session date must be in the future');
      }
      return true;
    }),
  body('max_participants')
    .isInt({ min: 1, max: 10000 })
    .withMessage('max_participants must be an integer between 1 and 10000'),
];

const updateSessionValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Session name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('date_time')
    .optional()
    .isISO8601()
    .withMessage('date_time must be a valid ISO 8601 date'),
  body('max_participants')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('max_participants must be an integer between 1 and 10000'),
];

module.exports = { createSessionValidator, updateSessionValidator };
