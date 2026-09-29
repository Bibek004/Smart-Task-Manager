// Import Express framework
const express = require("express");

// Import the MongoDB connection function from the config folder
const connectDB = require("./config/db");

// Load environment variables from .env file (like PORT, MONGO_URI)
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");

//
require('./cronJobs');


// Create an Express application
const app = express();

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies
  })
);

app.use(cookieParser());

// Import task routes
const taskRoutes = require("./routes/taskRoutes");



// ------------------- MIDDLEWARE ------------------- //

// Parse incoming JSON requests and attach to req.body
app.use(express.json());



// ------------------- DATABASE CONNECTION ------------------- //

// Call the connectDB function to establish MongoDB connection
connectDB();



// ------------------- ROUTES ------------------- //

// Import and use auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// Use the /api/tasks route group for all task-related endpoints
app.use("/api/tasks", taskRoutes);


// Define a simple GET route for testing the server
app.get("/", (req, res) => {
  res.send("Smart Task Manager API is running!");
});



// ------------------- START SERVER ------------------- //
// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
