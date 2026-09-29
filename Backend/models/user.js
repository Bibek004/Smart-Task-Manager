const mongoose = require("mongoose");

// Define the structure/schema for a User document
const UserSchema = new mongoose.Schema({
  name: {
    type: String,          // name is a string
    required: true,        // name must be provided
    trim: true             // remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,          // no two users can have the same email
    lowercase: true        // convert email to lowercase before saving
  },
  password: {
    type: String,
    required: true         // password must be provided
  }
});

// Export the model so we can use it in controllers
module.exports = mongoose.model("User", UserSchema);
