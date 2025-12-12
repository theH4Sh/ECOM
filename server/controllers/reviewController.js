const mongoose = require('mongoose')
const Review = require('../models/Review')

const createReview = async (req, res, next) => {
    const { rating, comment } = req.body
    const { productId } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' })
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be an integer between 1 and 5" })
    }

    if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: "Comment is required" })
    }

    try {
        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: userId,
            product: productId
        })

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' })
        }

        const review = new Review({
            user: userId,
            product: productId,
            comment: comment.trim(),
            rating
        })

        await review.save()
        
        // Populate user info before sending response
        await review.populate('user', '_id username name')
        
        res.status(201).json(review)
    } catch (error) {
        next(error)
    }
}

const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rating, comment } = req.body
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid review ID' })
        }

        if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
            return res.status(400).json({ error: "Rating must be an integer between 1 and 5" })
        }

        const updateData = {}
        if (rating !== undefined) updateData.rating = rating
        if (comment !== undefined) updateData.comment = comment.trim()

        const review = await Review.findOneAndUpdate(
            {
                _id: id,
                user: userId
            },
            { $set: updateData },
            { new: true }
        ).populate('user', '_id username name')

        if (!review) {
            return res.status(404).json({ error: 'Review not found or you do not have permission to update it' })
        }

        res.status(200).json(review)
    } catch (error) {
        next(error)
    }
}

const getReviews = async (req, res, next) => {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' })
    }

    try {
        const reviews = await Review.find({ product: productId })
            .populate('user', '_id username name')
            .sort({ createdAt: -1 })

        res.status(200).json({ reviews })
    } catch (error) {
        next(error)
    }
}

const deleteReview = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid review ID' })
    }

    try {
        const review = await Review.findOneAndDelete({
            _id: id,
            user: userId
        })

        if (!review) {
            return res.status(404).json({ error: "Review not found or you do not have permission to delete it" })
        }

        res.status(200).json({ message: 'Review deleted successfully', review })
    } catch (error) {
        next(error)
    }
}

module.exports = { createReview, updateReview, getReviews, deleteReview }
