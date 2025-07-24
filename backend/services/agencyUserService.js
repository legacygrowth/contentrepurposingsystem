const agencyUserModel = require('../models/agencyUserModel');

// Create a new agency user
const createAgencyUser = async function (agencyId, userId, userRole) {
  try {
    const newAgencyUser = new agencyUserModel();
    newAgencyUser.agencyId = agencyId;
    newAgencyUser.userId = userId;
    newAgencyUser.userRole = userRole;
    const createdAgencyUser = await newAgencyUser.save();
    return createdAgencyUser;
  } catch (error) {
    console.error("Error creating agency user:", error);
    return null;
  }
}

// Get a single agency user by ID
const getAgencyUserById = async function (id) {
  try {
    const agencyUser = await agencyUserModel.findById(id);
    return agencyUser;
  } catch (error) {
    console.error("Error getting agency user by ID:", error);
    return null;
  }
}

const getAgencyUserByUserId = async function (userId) {
  try {
    const agencyUser = await agencyUserModel.findOne({userId: userId});
    return agencyUser;
  } catch (error) {
    console.error("Error getting agency user by ID:", error);
    return null;
  }
}

// Get all agency users for a given agency ID
const getAgencyUsersByAgencyId = async function (agencyId) {
  try {
    const agencyUsers = await agencyUserModel.find({ agencyId });
    return agencyUsers;
  } catch (error) {
    console.error("Error getting agency users by agency ID:", error);
    return null;
  }
}

// Update agency user role by ID
const updateAgencyUserRole = async function (id, newRole) {
  try {
    const updatedUser = await agencyUserModel.findByIdAndUpdate(
      id,
      { userRole: newRole },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating agency user role:", error);
    return null;
  }
}
// Delete agency user by ID
const deleteAgencyUserById = async function (id) {
  try {
    const deletedUser = await agencyUserModel.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    console.error("Error deleting agency user:", error);
    return null;
  }
};

module.exports = { createAgencyUser, getAgencyUserById, getAgencyUsersByAgencyId,updateAgencyUserRole,deleteAgencyUserById, getAgencyUserByUserId};
