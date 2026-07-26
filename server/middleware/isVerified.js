const User = require('../models/userModel')

const isVerified = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const user = await User.findById(req.user._id).select('isVerified role')
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    if (user.role === 'admin') {
      return next()
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' })
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = isVerified
