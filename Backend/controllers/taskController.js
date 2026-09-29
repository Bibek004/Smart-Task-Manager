// Import the Task model which connects to the "tasks" collection in MongoDB
const Task = require("../models/task");


// Import the custom function we created to send emails using NodeMailer
const sendReminderEmail = require("../utils/emailService");


// Controller function to handle task creation
const createTask = async (req, res) => {
    try {

        // Destructure the task details from the request body
        const { title, description, deadline, priority, category, repeat } = req.body;


        // Validate that required fields are present (title and deadline are mandatory)
        if (!title || !deadline) {
            return res.status(400).json({ message: "Title and deadline are required" });
        }


        // Create a new task instance with the provided data
        // Also associate it with the currently logged-in user using req.user.userId (comes from JWT middleware)
        const task = new Task({
            userId: req.user.userId, // Automatically added via auth middleware
            title,
            description,
            deadline,
            priority,
            category,
            repeat,
        });


        // Save the task to the database using Mongoose
        await task.save();


        // Send success response with the newly created task data
        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    }
    catch (err) {

        // Log the error on the server side and send a 500 error response to the client
        console.error("Task creation error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


// Controller to get all tasks for the logged-in user according to filters if present
const getAllTasks = async (req, res) => {
    try {

        const { priority, category, repeat } = req.query;

        // Base query: get only tasks belonging to the logged-in user
        const query = { userId: req.user.userId };


        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (repeat) query.repeat = repeat;

        // req.user.userId is set by authMiddleware from JWT
        const tasks = await Task.find(query).sort({ deadline: 1 }); // sorted by nearest deadline first
        res.status(200).json(tasks);
    }
    catch (err) {
        console.log("Error fetching tasks", err.message);
        res.status(500).json({ message: "Server error while fetching tasks" });
    }
};


// Controller to get a single task by its ID
const getTaskById = async (req, res) => {
    try {
        // Extract the task ID from the URL parameter (e.g., /api/tasks/12345)
        const taskId = req.params.id;


        // Find the task in the database:
        // - _id must match the taskId from the URL
        // - userId must match the logged-in user's ID (from JWT middleware)
        const task = await Task.findOne({
            _id: taskId,
            userId: req.user.userId,
        });


        // If no task is found 
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }





        // If task is found, return it in the response
        res.status(200).json(task);

    }
    catch (err) {
        // Catch any unexpected errors (e.g., invalid ID format, DB issues)
        console.error("Error fetching task:", err.message);


        // Send a generic server error response
        res.status(500).json({ message: "Server error while fetching task" });
    }
};



const updateTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updates = req.body;

        // Only update the task if it belongs to the logged-in user
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.user.userId }, //filter
            updates,  //updates
            { new: true } // options  // return the updated document
        )

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        res.status(200).json(updatedTask, { message: "TAsk updated" });
    }
    catch {
        console.error("Error updating task:", err.message);
        res.status(500).json({ message: "Servor error while updating task" });
    }
};


// Controller to delete a task by its ID

const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Only delete if task belongs to the logged-in user
        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            userId: req.user.userId
        })

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }

        res.status(200).json({ message: "Task deleted successdully" });
    }
    catch (err) {
        console.error("Error deleting Task:", err.message);
        res.status(500).json({ message: "Server error while deleting task" });
    }
};

// Toggle task completion

const toogleTaskCompletion = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find task for current user
        const task = await Task.findOne({
            _id: taskId,
            userId: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found or authorized" });
        }

        // Toggle the current value
        task.isCompleted = !task.isCompleted;

        await task.save();

        res.status(200).json({
            message: `Task marked as ${task.isCompleted ? "completed" : "not completed"}`,
            task
        });
    }
    catch (err) {
        console.error("Error toggling task completion:", err.message);
        res.status(500).json({ message: "Server error while toggling task completion" });
    }
}

const deleteAllTasks = async (req, res) => {
    try {
        await Task.deleteMany({ userId: req.user.userId });
        res.status(200).json({ message: 'All tasks deleted successfully' });
    } catch (err) {
        console.error('Error deleting all tasks:', err.message);
        res.status(500).json({ message: 'Server error while deleting tasks' });
    }
};



// Export the function so it can be used in route files
module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    toogleTaskCompletion,
    deleteAllTasks
};
