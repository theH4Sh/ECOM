const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { createReview, updateReview, getReviews, deleteReview } = require('../controllers/reviewController')

const router = express.Router()

// Public route - get reviews for a product
router.get('/product/:productId', getReviews)

// Protected routes - require authentication
router.post('/product/:productId', requireAuth, createReview)
router.patch('/:id', requireAuth, updateReview)
router.delete('/:id', requireAuth, deleteReview)

module.exports = router
