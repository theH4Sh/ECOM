const Product = require('../models/Product')
const mongoose = require('mongoose')

const getAllProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "reviews",               // Mongo collection name
          localField: "_id",
          foreignField: "product",
          as: "reviews"
        }
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0
            ]
          }
        }
      },
      {
        $project: {
          reviews: 0 // remove heavy array
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        //validating id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error("Invalid product id")
            error.status = 400
            return next(error)
        }
        
        const product = await Product.findById(id)
        
        if (!product) {
            const error = new Error("Product Not Found")
            error.status = 404
            return next(error)
        }

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
     try {
        const { id } = req.params
        //validating id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error("Invalid product id")
            error.status = 400
            return next(error)
        }
        
        const deleteProduct = await Product.findByIdAndDelete(id)
        
        if (!deleteProduct) {
            const error = new Error("Product Not Found")
            error.status = 404
            return next(error)
        }

        res.status(200).json({ message: 'Product Deleted Successfully', deleteProduct })
    } catch (error) {
        next(error)
    }   
}

const addProduct = async (req, res, next) => {
    try {
        const { name, price, description, quantity } = req.body

        if (!req.file) {
            return res.status(400).json({error: 'Product Image Required'})
        }

        const newProduct = new Product({
            name,
            price,
            description,
            quantity,
            image: req.file.filename,
        })
        
        await newProduct.save()
        res.status(201).json(newProduct)
    } catch (error) {
        next(error)
    }
}

module.exports = { getAllProducts, getProduct, deleteProduct, addProduct }