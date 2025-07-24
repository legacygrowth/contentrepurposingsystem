const agencyUserService = require("../services/agencyUserService");
const mongoose = require("mongoose");

// Create a new AgencyUser
exports.createAgencyUser = async (req, res) => {
  const { agencyId, userId, userRole } = req.body;

  try {
    const agencyUser = await agencyUserService.createAgencyUser(
      agencyId,
      userId,
      userRole
    );
    res.status(200).json({ message: "AgencyUser created", agencyUser });
  } catch (err) {
    res.status(500).json({ message: "Creation error", error: err.message });
  }
};

// Get AgencyUser by ID
exports.getAgencyUserById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const agencyUser = await agencyUserService.getAgencyUserById(id);
    if (!agencyUser) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ agencyUser });
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

// Get all users by Agency ID
exports.getAgencyUsersByAgencyId = async (req, res) => {
  const agencyId = req.params.agencyId;

  try {
    const users = await agencyUserService.getAgencyUsersByAgencyId(agencyId);
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

// Update AgencyUser role by ID
exports.updateAgencyUserRole = async (req, res) => {
  const id = req.params.id;
  const { userRole } = req.body;

  try {
    const updated = await agencyUserService.updateAgencyUserRole(id, userRole);
    res.status(200).json({ message: "Updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};

// Delete AgencyUser by ID
exports.deleteAgencyUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await agencyUserService.deleteAgencyUserById(id);
    res.status(200).json({ message: "Deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
};
