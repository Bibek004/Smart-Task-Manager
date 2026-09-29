const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logout,
    getUser,
    deleteUser,
    updateUser,
    updatePassword
} = require("../controllers/authController");
const user = require("../models/user");

const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
// This route handles new user registration
router.post("/register", registerUser);

// POST /api/auth/login
// This route handles login of existing user
router.post("/login", loginUser);

// POST /api/auth/logout
// This route handles logout of existing user
router.post("/logout", logout);

// GET /api/auth/user
// This route handles login of existing user
router.get("/user", authMiddleware, getUser);

// DELETE /api/auth/user
// This route handles delete account of existing user
router.delete("/user", authMiddleware, deleteUser);

// PUT /api/auth/user
// This route handles uername/email change of existing user
router.put("/user", authMiddleware, updateUser);


// PUT /api/auth/user/update-password
// This route handles password change of existing user
router.put('/user/update-password', authMiddleware, updatePassword);


module.exports = router;