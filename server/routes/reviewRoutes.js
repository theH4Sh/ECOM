const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const isVerified = require('../middleware/isVerified')
const { createReview, updateReview, getReviews, deleteReview } = require('../controllers/reviewController')

const router = express.Router()

// Public route - get reviews for a product
router.get('/product/:productId', getReviews)

// Protected routes - require authentication
router.post('/product/:productId', requireAuth, isVerified, createReview)
router.patch('/:id', requireAuth, isVerified, updateReview)
router.delete('/:id', requireAuth, isVerified, deleteReview)

module.exports = router
