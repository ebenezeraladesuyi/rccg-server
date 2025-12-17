"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBooking = void 0;
const express_validator_1 = require("express-validator");
exports.validateBooking = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('contactNumber')
        .trim()
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid contact number'),
    (0, express_validator_1.body)('proposedDate')
        .notEmpty().withMessage('Proposed date is required')
        .isISO8601().withMessage('Please enter a valid date in YYYY-MM-DD format')
        .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }).withMessage('Proposed date must be today or in the future'),
    (0, express_validator_1.body)('eventType')
        .trim()
        .notEmpty().withMessage('Event type is required')
        .isLength({ min: 2, max: 100 }).withMessage('Event type must be between 2 and 100 characters'),
    (0, express_validator_1.body)('expectedGuests')
        .notEmpty().withMessage('Number of expected guests is required')
        .isInt({ min: 1, max: 300 }).withMessage('Expected guests must be between 1 and 300'),
    (0, express_validator_1.body)('eventStartTime')
        .notEmpty().withMessage('Event start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter a valid time in HH:MM format'),
    (0, express_validator_1.body)('eventEndTime')
        .notEmpty().withMessage('Event end time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter a valid time in HH:MM format')
        .custom((value, { req }) => {
        if (value <= req.body.eventStartTime) {
            throw new Error('Event end time must be after start time');
        }
        return true;
    }),
    (0, express_validator_1.body)('additionalNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Additional notes cannot exceed 1000 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];
