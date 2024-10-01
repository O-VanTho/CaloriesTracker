const express = require('express');
const connectDB = require('./db'); // Import the connectDB function

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Connect to the database
connectDB();

// Define routes
app.get('/', (req, res) => {
    res.send("Welcome to the Calories Tracker API!");
});

// Example route for a 'calories' resource
app.get('/api/calories', (req, res) => {
    // Logic to retrieve calories data from MongoDB
    res.json({ message: "Get calories data" });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("404 - Not Found");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start the server
app.listen(3000, () => {
    console.log("App is running on http://localhost:3000");
});
