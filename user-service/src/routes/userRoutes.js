const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: 'Too many login attempts from this IP, please try again later.'
});

// User Registration with validation
router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userController.register);

// User Login with rate limiting
router.post('/login', loginLimiter, userController.login);

// Get User Profile (Protected route)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;