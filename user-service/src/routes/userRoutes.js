const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Middleware for JWT verification

// User Registration
router.post('/register', userController.register);

// User Login
router.post('/login', userController.login);

// Get User Profile (Protected route)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;