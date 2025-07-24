const UserType = require('../models/userTypes');

// Create a new user type
const createUserType = async (data) => {
  const userType = new UserType(data);
  return await userType.save();
};

// Get all user types
const getAllUserTypes = async () => {
  return await UserType.find().populate('userId');
};

// Get a user type by ID
const getUserTypeById = async (id) => {
  return await UserType.findById(id).populate('userId');
};

// Update a user type by ID
const updateUserType = async (id, data) => {
  return await UserType.findByIdAndUpdate(id, data, { new: true });
};

// Delete a user type by ID
const deleteUserType = async (id) => {
  return await UserType.findByIdAndDelete(id);
};

module.exports = {
  createUserType,
  getAllUserTypes,
  getUserTypeById,
  updateUserType,
  deleteUserType
};
