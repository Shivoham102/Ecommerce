const { findByIdAndUpdate } = require("../models/productModel");
const Product = require("../models/productModel");

//Create a product
exports.createProduct = async (req,res,next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}

//Get all products
exports.getAllProducts = async (req,res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products})
}

//Update a product
exports.updateProduct = async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        res.status(500).json({
            success: false,
            message: "No product found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    })
}

//Get details of a product
exports.getProductDetails = async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        res.status(500).json({
            success: false,
            message: "No product found"
        })
    }

    res.status(200).json({
        success: true,
        message: "Details fetched successfully",
        product
    })
}

//Delete a product
exports.deleteProduct = async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        res.status(500).json({
            success: false,
            message: "No product found"
        })
    }

    await Product.findByIdAndDelete(req.params.id,req.body);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
}