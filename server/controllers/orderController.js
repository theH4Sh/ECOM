const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET)

const createOrder = async (req, res, next) => {
    try {
        const { items, name, phone, address } = req.body
        const userId = req.user._id

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' })
        }

        if (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' })
        }

        if (!address) {
            return res.status(400).json({ message: 'Shipping address is required' })
        }

        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            const product = await Product.findById(item.product)

            if (!product) {
                return res.status(404).json({ message: `Product not found` })
            }

            totalAmount += product.price * item.quantity
            
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { userId: userId.toString() },
        })

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            name,
            phone,
            address,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            stripePaymentIntentId: paymentIntent.id
        })

        await order.save()
        res.status(201).json({
            message: 'Order Created Successfully', 
            order, 
            clientSecret: paymentIntent.client_secret 
        })
    } catch (error) {
        next(error)
    }
}

const markPaid = async (req, res, next) => {
    try {
        const { orderId } = req.params
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid Order ID'})
        }

        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ message: 'Order not found'})

        order.paymentStatus = "paid";
        await order.save()

        for (const item of order.items) {
            const product = await Product.findById(item.product)
            product.stock -= item.quantity
            await product.save()
        }

        res.status(201).json({ message: "Order marked as paid", order})
    } catch (error) {
        next(error)
    }
}

const getOrders = async (req, res, next) => {
    try {
        const userId = req.user._id
        const orders = await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 })
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user'})
        }

        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 })
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found'})
        }

        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        order.orderStatus = status
        await order.save()

        res.status(200).json({ message: 'Order status updated successfully', order })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    markPaid
}