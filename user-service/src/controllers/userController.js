const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc User Registration
 * @route POST /api/users/register
 * @access Public
 * @param {Object} req - Express request object containing username, email, and password in the body
 * @param {Object} res - Express response object to send back the response
 */
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc User Login
 * @route POST /api/users/login
 * @access Public
 * @param {Object} req - Express request object containing email and password in the body
 * @param {Object} res - Express response object to send back the response
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token and user information (excluding password)
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Get User Profile
 * @route GET /api/users/profile
 * @access Private
 * @param {Object} req - Express request object with user ID in req.user (set by authentication middleware)
 * @param {Object} res - Express response object to send back the user profile
 */
exports.getProfile = async (req, res) => {
    try {
        // Find user by ID and exclude the password from the response
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};