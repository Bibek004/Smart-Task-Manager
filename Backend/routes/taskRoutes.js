const express = require("express");
const router = express.Router();
const {
    createTask, 
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    toogleTaskCompletion,
    deleteAllTasks
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");


// Route to create a new task
// POST /api/tasks
router.post("/", authMiddleware, createTask);


// Route to Get all tasks of a user
// GET /api/tasks
router.get("/", authMiddleware, getAllTasks);

// Route to Delete all tasks of a user
// DELETE /api/tasks
router.delete("/", authMiddleware, deleteAllTasks);

// Route to get a single task
// GET /api/tasks/:id
router.get("/:id", authMiddleware, getTaskById);


// Route to update a single task
// PUT /api/tasks/:id
router.put("/:id", authMiddleware, updateTaskById);


// Route to delete a single task
// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, deleteTaskById);

//Toggle task completion
//PATCH /:id/toggle
router.patch("/:id/toggle", authMiddleware, toogleTaskCompletion);

module.exports = router;