const errorhandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.message = `${field} already exists.`;
        err.statusCode = 400;
    }

    if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    err.message = messages.join('. ');
    err.statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token';
    err.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        err.message = 'Token expired';
        err.statusCode = 401;
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });

}

module.exports = errorhandler;