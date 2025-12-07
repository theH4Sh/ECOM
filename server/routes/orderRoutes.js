const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')
const { createOrder, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController')

const router = express.Router()

router.post('/create-order', requireAuth, createOrder)

router.get('/get-orders', requireAuth, getOrders)

router.get('/get-all-orders', requireAuth, isAdmin, getAllOrders)

router.patch('/update-order-status/:orderId', requireAuth, isAdmin, updateOrderStatus)

module.exports = router