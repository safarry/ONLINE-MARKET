// ─────────────────────────────────────────
// controllers/authController.js
// Register, Login, Get current user
// ─────────────────────────────────────────

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ─── Helper: Generate JWT ────────────────
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// ─── POST /api/v1/auth/register ──────────
const register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // 3. Create user (password hashing happens in the model pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'buyer', // default to buyer
        });

        // 4. Generate token
        const token = generateToken(user._id);

        // 5. Respond (password is excluded by toJSON method)
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        // Mongoose validation errors are caught by the global errorHandler
        throw error;
    }
};

// ─── POST /api/v1/auth/login ─────────────
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // 2. Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // 3. Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // 4. Generate token
        const token = generateToken(user._id);

        // 5. Respond (toJSON strips password)
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        throw error;
    }
};

// ─── GET /api/v1/auth/me ─────────────────
// Protected route — requires valid token
const getMe = async(req, res) => {
    try {
        // req.user is attached by verifyToken middleware
        res.status(200).json({
            success: true,
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        throw error;
    }
};

module.exports = { register, login, getMe };