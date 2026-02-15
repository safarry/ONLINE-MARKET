/**
 * Pagination helper
 */
const paginate = (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};

/**
 * API response formatter
 */
const successResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Generate random token
 */
const crypto = require('crypto');

const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Filter object keys
 */
const filterObject = (obj, allowedFields) => {
    const filtered = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) {
            filtered[key] = obj[key];
        }
    });
    return filtered;
};

/**
 * Calculate pagination metadata
 */
const getPaginationMetadata = (totalDocs, page, limit) => {
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        total: totalDocs,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage,
        hasPrevPage
    };
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

module.exports = {
    paginate,
    successResponse,
    generateToken,
    filterObject,
    getPaginationMetadata,
    sanitizeInput
};