const SocialMedia = require("../models/socialMedia");

// Get all social media
exports.getAllSocialMedia = async (req, res) => {
  try {
    const socialMediaData = await SocialMedia.find();
    res.status(200).json(socialMediaData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new social media
exports.createSocialMedia = async (req, res) => {
  try {
    const { platform, profileData } = req.body;
    const newConfig = new SocialMedia({ platform, profileData });
    const savedConfig = await newConfig.save();
    res.status(201).json(savedConfig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update social media
exports.updateSocialMedia = async (req, res) => {
  try {
    const updatedConfig = await SocialMedia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedConfig) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updatedConfig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete social media
exports.deleteSocialMedia = async (req, res) => {
  try {
    const deleted = await SocialMedia.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not Found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
