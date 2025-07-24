const User = require('../models/authenticateUser');
const tempUserService=require("../services/tempUserService")

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};



// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
