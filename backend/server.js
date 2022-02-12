const app = require("./app");
const connectDatabase = require("./database")
const dotenv = require("dotenv")


//Handling Uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");

    server.close(() => {
        process.exit(1);
    });
});

//Config
dotenv.config({path: "backend/config/config.env"});

//Connecting to database
connectDatabase()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});


//Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    });
});