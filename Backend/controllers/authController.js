const User = require("../models/user");
const bcrypt = require("bcrypt"); // used to hash passwords
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Store in .env in production



// Controller to handle user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Check if both fields are provided

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        // Step 2: Check if user exists

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        // Step 3: Compare password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        // Step 4: Create JWT token

        const token = jwt.sign(
            { userId: user._id, email: user.email }, // payload
            JWT_SECRET,                             // secret
            { expiresIn: "1d" }                     // token validity
        );


        // Step 5: Return token to frontend
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: token,
            message: 'Login successful',
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};



// Controller to handle user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Checking if all the fields are present

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are permanent" });
        }

        // Step 1: Check if user already exists with this email

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Step 2: Generate salt and hash the password

        const salt = await bcrypt.genSalt(10); // 10 is the cost factor
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 3: Create a new user document

        const user = new User({
            name,
            email,
            password: hashedPassword // save the hashed password
        });

        // Step 4: Save user to database

        await user.save();

        // Step 5: Respond with success

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {

        // Handle any server errors

        console.error("Registration error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false, // set to true if you're using HTTPS
    });
    return res.status(200).json({ message: 'Logged out successfully' });
};



const getUser = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT by auth middleware

        //console.log(req);

        const user = await User.findById(userId).select("name email"); // Fetch only needed fields

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT token

        // Delete the user from the database
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.userId; // Extracted from JWT token

        // Find the user and update their profile
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Send the updated user data
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err.message);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    deleteUser,
    updateUser,
    updatePassword
};
