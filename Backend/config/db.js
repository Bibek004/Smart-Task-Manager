// Import the mongoose library for interacting with MongoDB
const mongoose = require("mongoose");

// Load environment variables from a .env file into process.env
require("dotenv").config();

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
	try {
		// Try to connect to the MongoDB database using the URI stored in .env
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,        // Use the new URL parser instead of the deprecated one
			useUnifiedTopology: true,     // Use the new server discovery and monitoring engine
		});

		// If the connection is successful, log this message
		console.log("MongoDB connected successfully");
	} catch (err) {
		// If there's an error while connecting, log the error message
		console.error("MongoDB connection failed:", err.message);

		// Exit the process with a failure code (1 means error)
		process.exit(1);
	}
};

// Export the connectDB function so it can be used in other files
module.exports = connectDB;
