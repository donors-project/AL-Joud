const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// Sign up (Always assigns "donor" role)
const signup = async (req, res) => {
  try {
    const { full_name, email, password, address, phone } = req.body;
    let imageUrl = null;

    // Check if an image is uploaded
    if (req.file) {
      imageUrl = req.file.path; // Multer with Cloudinary auto-uploads and returns a URL
    }

    // Hash password before saving (important for security)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword, // Store hashed password
      role: "donor", // Default role
      address,
      phone,
      image: imageUrl, // Store Cloudinary image URL
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image, // Return uploaded image URL
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
};


const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Stored Hashed Password:", user.password);
    console.log("Entered Password:", password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password comparison failed");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login Successful. Token:", token);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};


// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { full_name, email, password, address, phone, image } = req.body;

    // Hash new password if provided
    const updatedFields = { full_name, email, address, phone, image };
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    await user.update(updatedFields);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  signup,
  signin,
  updateUser,
  deleteUser,
};