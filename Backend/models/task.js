const mongoose = require("mongoose");

// Define the schema for a task
const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: String, // Optional description of the task

    deadline: {
        type: Date, // Deadline must be a valid date
        required: true
    },

    priority: {
        type: String,
        enum: ["High", "Medium", "Low"], // Allowed values only
        default: "Medium"
    },

    category: {
        type: String,
        enum: ["Work", "Study", "Personal", "Other"],
        default: "Other"
    },

    repeat: {
        type: String,
        enum: ["None", "Daily", "Weekly", "Monthly"], // Task recurrence
        default: "None"
    },
    
    createdAt: {
        type: Date,
        default: Date.now // Automatically set when task is created
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    reminderSent: {
        type: Boolean,
        default: false
    }
});

// Export the Task model
module.exports = mongoose.model("Task", taskSchema);






