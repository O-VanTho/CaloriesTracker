const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(
            'mongodb+srv://vantho074:MGiiUxHJnih7TwOx@calories-tracker.neioe.mongodb.net/?retryWrites=true&w=majority&appName=calories-tracker',
        );
        console.log(`MongoDB connected: ${connect.connection.host}`); // Log connection success
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`); // Log connection error
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
