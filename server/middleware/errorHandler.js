const AppError = require('../utils/AppError')

const normalizeError = (err) => {
    if (err instanceof AppError || err.status) {
        return err
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ')
        return new AppError(message, 400)
    }

    if (err.name === 'CastError') {
        return new AppError('Invalid ID format', 400)
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field'
        return new AppError(`${field} already exists`, 409)
    }

    if (err.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401)
    }

    if (err.name === 'TokenExpiredError') {
        return new AppError('Token expired', 401)
    }

    if (err.name === 'MulterError') {
        return new AppError(err.message, 400)
    }

    if (err.message === 'Only JPG, PNG, and WebP images are allowed') {
        return new AppError(err.message, 400)
    }

    return err
}

const errorHandler = (err, req, res, next) => {
    const error = normalizeError(err)

    console.error(error.stack || error.message)

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    })
}

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
}

module.exports = { errorHandler, notFoundHandler }
