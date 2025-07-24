const userTypesService = require('../services/userTypesService');

// Create
exports.createUserType = async (req, res) => {
  try {
    const result = await userTypesService.createUserType(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all
exports.getAllUserTypes = async (req, res) => {
  try {
    const result = await userTypesService.getAllUserTypes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read one
exports.getUserTypeById = async (req, res) => {
  try {
    const result = await userTypesService.getUserTypeById(req.params.id);
    if (!result) return res.status(404).json({ message: "User type not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
exports.updateUserType = async (req, res) => {
  try {
    const result = await userTypesService.updateUserType(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "User type not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
exports.deleteUserType = async (req, res) => {
  try {
    const result = await userTypesService.deleteUserType(req.params.id);
    if (!result) return res.status(404).json({ message: "User type not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
