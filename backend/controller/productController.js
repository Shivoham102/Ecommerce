const { findByIdAndUpdate } = require("../models/productModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


//Create a product
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .paginate(resultsPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
    });
});

//Update a product
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("No product found", 404));
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
    });
});

//Get details of a product
exports.getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    // Product.findById(req.params.id, function (err, product) {
    // if (!product) {
    //     return next(new ErrorHandler("No product found", 404))
    // }
    res.status(200).json({
        success: true,
        message: "Details fetched successfully",
        product
    });
    // });
});

//Delete a product
exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        res.status(500).json({
            success: false,
            message: "No product found"
        });
    }

    await Product.findByIdAndDelete(req.params.id,req.body);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});