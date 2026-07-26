const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')
const isVerified = require('../middleware/isVerified')
const { createOrder, getOrders, getAllOrders, updateOrderStatus, markPaid } = require('../controllers/orderController')

const router = express.Router()

router.post('/create-order', requireAuth, isVerified, createOrder)

router.get('/get-orders', requireAuth, isVerified, getOrders)

router.get('/get-all-orders', requireAuth, isAdmin, getAllOrders)

router.put('/mark-paid/:orderId', requireAuth, isVerified, markPaid)

router.patch('/update-order-status/:orderId', requireAuth, isAdmin, updateOrderStatus)

module.exports = router