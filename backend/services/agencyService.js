const Agency = require('../models/agencyModel');

// Create an agency
const createAgency = async function(name, userId) {
  try {
    var newAgency = new Agency();
    newAgency.name = name;
    newAgency.userId = userId;
    let createdAgency = await newAgency.save();
    return createdAgency;
  } catch (error) {
    return null;
  }
}

// Get agency by ID
const getAgencyById = async function (agencyId) {
  try {
 
    const getAgency = await Agency.findById(agencyId);
    console.log(getAgency);
    return getAgency;
  } catch (error) {
    return null;
  }
}

// Get all agencies
const getAllAgencies = async function () {
  try {
    var agencyList = await Agency.find();
    return agencyList;
  } catch (error) {
    return null;
  }
}

// Update agency by ID
const updateAgencyById = async function(id, name, userId) {
  try {
    var updatedAgency = await Agency.findByIdAndUpdate(
      id,
      { name: name, userId: userId },
      { new: true }
    );
    return updatedAgency;
  } catch (error) {
    return null;
  }
}

// Delete agency by ID
const deleteAgencyById = async function(id) {
  try {
    var deletedAgency = await Agency.findByIdAndDelete(id);
    return deletedAgency;
  } catch (error) {
    return null;
  }
}

module.exports = {createAgency,getAgencyById,getAllAgencies,updateAgencyById,deleteAgencyById};
