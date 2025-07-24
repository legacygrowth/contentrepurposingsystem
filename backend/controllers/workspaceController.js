const workspaceService = require('../services/workspaceService');
const mongoose = require('mongoose');

exports.createWorkspace = async (req, res) => {
  try {
    const { name, userId, agencyId } = req.body;
    var createdWorkSpace = await workspaceService.createWorkspace(name, new mongoose.Types.ObjectId(userId),new  mongoose.Types.ObjectId(agencyId));
    
    res.status(201).json(createdWorkSpace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceService.getAllWorkspaces();
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkspaceById = async (req, res) => {
  var workspaceId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const workspace = await workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkspace = async (req, res) => {
  var workspaceId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const {name, userId} = req.body;
    const updated = await workspaceService.updateWorkspace(workspaceId, name, userId);
    if (!updated) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkspace = async (req, res) => {
  var workspaceId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const deleted = await workspaceService.deleteWorkspace(workspaceId);
    if (!deleted) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ message: "Workspace Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
