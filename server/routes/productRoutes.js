const express = require('express')
const { getAllProducts, getProduct, deleteProduct, addProduct, updateProduct, searchProducts } = require('../controllers/productController')
const upload = require('../middleware/upload')
const requireAuth = require('../middleware/requireAuth')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

router.get("/product/search", searchProducts)
router.get('/product', getAllProducts)
router.get('/product/:id', getProduct)
router.put('/product/:id', requireAuth, isAdmin, upload.single('image'), updateProduct)


// Admin Routes
router.delete('/product/:id', requireAuth, isAdmin, deleteProduct)
router.post('/product', upload.single('image'), requireAuth, isAdmin, addProduct)

module.exports = router