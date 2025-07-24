const Workspace = require('../models/workspaceModel');


const createWorkspace = async function(name, userId,agencyId) {
  try {
    var newWorkeSpace = new Workspace();
    newWorkeSpace.name = name;
    newWorkeSpace.userId = userId;
    newWorkeSpace.agencyId=agencyId;
    let createdWorkspace = await newWorkeSpace.save();
    return createdWorkspace;
  } catch (error) {
    return null;
  }
}

const getWorkspaceById = async function (workspaceId) {
  try {
    let getWorkspace = await Workspace.findById(workspaceId);
    console.log(getWorkspace)
    return getWorkspace;
  } catch (error) {
    return null;
  }
}

const getAllWorkspaces = async function () {
  try {
    var workspaceList = await Workspace.find();
    return workspaceList;
  } catch (error) {
    return null;
  }
}

const updateWorkspace = async function (id, name, userId,agencyId) {
  try {
    var updatedWorkspace = await Workspace.findByIdAndUpdate(
      id,
      {name: name, userId: userId, agencyId:agencyId},
      { new: true }
    );
    return updatedWorkspace;
  } catch (error) {
    return null;
  }
}

const deleteWorkspace = async function (id) {
  try {
    var updatedWorkspace = await Workspace.findByIdAndDelete(id);
    return updatedWorkspace;
  } catch (error) {
    return null;
  }
}

module.exports = { createWorkspace, getWorkspaceById, getAllWorkspaces, updateWorkspace, deleteWorkspace };