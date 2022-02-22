const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const req = require("express/lib/request");

//Register a User
exports.registerUser = catchAsyncErrors( async(req,res,next) => {

    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar: {
            public_id: "A sample id",
            url: "Sample url", 
        }
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
    });
});

exports.loginUser = catchAsyncErrors( async(req,res,next) => {
    
    const {email,password} = req.body;

    //Check if email and password both are provided

    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched  = user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = user.getJWTToken();

    res.status(200).json({
        success: true,
        token,
    });
})