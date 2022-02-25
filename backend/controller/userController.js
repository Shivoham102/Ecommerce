const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const req = require("express/lib/request");
const sendToken = require("../utils/jtwToken");
const sendEmail = require("../utils/sendEmail");

//Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next) => {

    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar: {
            public_id: "A sample id",
            url: "Sample url", 
        }
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async(req,res,next) => {
    
    const {email,password} = req.body;

    //Check if email and password both are provided

    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched  = await user.comparePassword(password);
    
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
})

exports.logoutUser = catchAsyncErrors(async (req,res,next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = User.findOne({email: req.body.email});

    if(!user) {
        new ErrorHandler("No user found", 404);
    }

    //Get reset password token
    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforesave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Greetings ${user.name}, \n\n Your password reset token is: \n\n ${resetPasswordUrl} \n\n If you have not requested this email, then please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,

        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforesave: false });

        return next(new ErrorHandler(error.message, 500))
        
    }

})