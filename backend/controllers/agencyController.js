const agencyService = require('../services/agencyService');
const mongoose = require('mongoose');

// Create an agency
exports.createAgency = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const createdAgency = await agencyService.createAgency(name, new mongoose.Types.ObjectId(userId));
    res.status(201).json(createdAgency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all agencies
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await agencyService.getAllAgencies();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get agency by ID
exports.getAgencyById = async (req, res) => {
  var agencyId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const agency = await agencyService.getAgencyById(agencyId);
    if (!agency) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update agency by ID
exports.updateAgency = async (req, res) => {
  const agencyId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const { name, userId } = req.body;
    const updated = await agencyService.updateAgencyById(agencyId, name, userId);
    if (!updated) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete agency by ID
exports.deleteAgency = async (req, res) => {
  const agencyId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const deleted = await agencyService.deleteAgencyById(agencyId);
    if (!deleted) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ message: "Agency Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
