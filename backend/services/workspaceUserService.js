const sysWorkspaceUser = require('../models/sysWorkspaceUser');
require("../models/workspaceModel")
const mongoose = require("mongoose");

const createWorkspaceUser = async function(workspaceId, userId,isPrimary) {
  try {
    var newSysWorkspaceUser = new sysWorkspaceUser();
    newSysWorkspaceUser.workspaceId = workspaceId;
    newSysWorkspaceUser.userId = userId;
    newSysWorkspaceUser.isPrimary=isPrimary;
    var createdWorkspaceUser = await newSysWorkspaceUser.save();
    return createdWorkspaceUser;
  } catch (error) {
    return null;
  }
}

const getAllWorkspaceUsers=async function(){
  try {
    return await sysWorkspaceUser.find();
  } catch (error) {
    throw new Error("error fetching workspace user:"+error.message)
  }
}

const getWorkspaceUsersByUserId = async function(userId) {
  try {
    return await sysWorkspaceUser.findOne({userId: userId, isPrimary: true});
  } catch (error) {
    throw new Error("Error fetching workspaces for user: " + error.message);
  }
};


const getAllWorkspacesUsersByUserId = async function(userId) {
  console.log(userId);
  

  try {
 const objectId = new mongoose.Types.ObjectId(userId);
     return await sysWorkspaceUser.find({userId: objectId}).populate("workspaceId").exec();
  } catch (error) {
    throw new Error("Error fetching workspaces for user: " + error.message);
  }
};




module.exports = { createWorkspaceUser, getAllWorkspaceUsers, getWorkspaceUsersByUserId, getAllWorkspacesUsersByUserId };