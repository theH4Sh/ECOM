const Order = require('../models/Order')
const Product = require('../models/Product')

const createOrder = async (req, res, next) => {
    try {
        const { items } = req.body
        const userId = req.user._id

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

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            paymentStatus: 'pending'
        })

        await order.save()
        res.status(201).json({ message: 'Order Created Successfully', order })
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

module.exports = {
    createOrder,
    getOrders,
    getAllOrders
}