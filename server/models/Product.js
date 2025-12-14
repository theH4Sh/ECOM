const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true }, // how many units are available
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
