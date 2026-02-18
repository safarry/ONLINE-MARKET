// ─────────────────────────────────────────
// middleware/authMiddleware.js
// JWT verification & role-based access control
// ─────────────────────────────────────────

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ─── Verify Token ────────────────────────
const verifyToken = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format. Use: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to req (exclude password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    // Token malformed / invalid
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

// ─── Role Check ──────────────────────────
// Usage: authorizeRoles('admin', 'seller')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };