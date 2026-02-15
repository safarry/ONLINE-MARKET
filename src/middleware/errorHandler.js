const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error Stack:', err.stack);
    }

    const statusCode = err.statusCode || err.status || 500;

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `Duplicate value for field: ${field}`,
        });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON in request body',
        });
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Something went wrong on the server' : err.message,
    });
};

module.exports = { errorHandler };