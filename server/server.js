const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderRoutes = require('./routes/orderRoutes')
const notificationRoutes = require("./routes/notificationRoutes");

//models
const Product = require("./models/Product")

const app = express()
const cors = require('cors')

//Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use("/images", express.static(path.join(__dirname, "images")));

//MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MONGODB Connected"))
    .catch((err) => console.log(err))

//API Routes
app.use('/api/auth', userRoutes)
app.use('/api', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/order', orderRoutes)
app.use("/api/notifications", notificationRoutes);

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler')

app.use(notFoundHandler)
app.use(errorHandler)

// const port = 8000
// app.listen(port, () => {
//     console.log(`Listening on port: ${port}`)
// })

module.exports = app;