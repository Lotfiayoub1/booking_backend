const { body } = require('express-validator');

const createBookingValidator = [
  body('student_name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Student name must be between 2 and 150 characters'),
  body('student_email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('student_email must be a valid email address'),
];

module.exports = { createBookingValidator };
