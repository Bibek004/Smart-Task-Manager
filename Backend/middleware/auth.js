// Import the 'jsonwebtoken' package to handle JWT token operations

const jwt = require("jsonwebtoken");

// Load the secret key used to sign and verify tokens (stored in .env for security)

const JWT_SECRET = process.env.JWT_SECRET;

// Create an authentication middleware function

const authMiddleware = (req, res, next) => {

    // Extract the token from the Authorization header (format: "Bearer <token>")
    //const token = req.header("Authorization")?.replace("Bearer ", "");

    // Extract the token from the cookie 
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");


    // If token is not present, reject the request
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try{

        // Try verifying the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);


        // If verification is successful, attach the decoded user data to the request object
        // So it can be accessed in later routes (like req.user.userId)
        req.user = decoded;

        
        // Continue to the next middleware or route handler
        next();
    }
    catch(err){
        // If token is invalid or expired, send error response
        return res.status(400).json({ message: "Invalid token." });
    }
};

// Export the middleware to use in protected routes
module.exports = authMiddleware;
