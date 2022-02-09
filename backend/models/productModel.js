const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product name"]
    },
    description: {
        type: String,
        required: [true, "Please enter the description name"]
    },
    price: {
        type: String,
        required: [true, "Please enter the product price"]
    }
})