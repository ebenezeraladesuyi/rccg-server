import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateBooking = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('contactNumber')
        .trim()
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please enter a valid contact number'),
    
    body('proposedDate')
        .notEmpty().withMessage('Proposed date is required')
        .isISO8601().withMessage('Please enter a valid date in YYYY-MM-DD format')
        .custom((value: any) => {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }).withMessage('Proposed date must be today or in the future'),
    
    body('eventType')
        .trim()
        .notEmpty().withMessage('Event type is required')
        .isLength({ min: 2, max: 100 }).withMessage('Event type must be between 2 and 100 characters'),
    
    body('expectedGuests')
        .notEmpty().withMessage('Number of expected guests is required')
        .isInt({ min: 1, max: 300 }).withMessage('Expected guests must be between 1 and 300'),
    
    body('eventStartTime')
        .notEmpty().withMessage('Event start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter a valid time in HH:MM format'),
    
    body('eventEndTime')
        .notEmpty().withMessage('Event end time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter a valid time in HH:MM format')
        .custom((value: any, { req }: any) => {
            if (value <= req.body.eventStartTime) {
                throw new Error('Event end time must be after start time');
            }
            return true;
        }),
    
    body('additionalNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Additional notes cannot exceed 1000 characters'),
    
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
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