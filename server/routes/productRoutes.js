const express = require('express')
const { getAllProducts, getProduct, deleteProduct, addProduct } = require('../controllers/productController')
const upload = require('../middleware/upload')
const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

router.get('/product', getAllProducts)
router.get('/product/:id', getProduct)

// Admin Routes
router.delete('/product/:id', requireAuth, isAdmin, deleteProduct)
router.post('/product', upload.single('productImage'), requireAuth, isAdmin, addProduct)

module.exports = router