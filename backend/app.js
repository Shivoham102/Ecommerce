const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json());

//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
app.use("/", product);
app.use("/", user);

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app;