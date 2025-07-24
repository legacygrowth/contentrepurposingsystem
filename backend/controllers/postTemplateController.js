const PostTemplate = require('../models/postTemplate');

// Get All PostTemplates
exports.getAllPostTemplates = async (req, res) => {
  try {
    const postTemplates = await PostTemplate.find();
    res.status(200).json(postTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get PostTemplate by ID
exports.getPostTemplateById = async (req, res) => {
  try {
    const postTemplate = await PostTemplate.findById(req.params.id);
    if (!postTemplate) return res.status(404).json({ message: "PostTemplate not found" });
    res.status(200).json(postTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create New PostTemplate
exports.addPostTemplate = async (req, res) => {
  const { title, description, category, tags } = req.body;
  try {
    const newPostTemplate = new PostTemplate({ title, description, category, tags });
    await newPostTemplate.save();
    res.status(201).json(newPostTemplate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update PostTemplate
exports.updatePostTemplate = async (req, res) => {
  try {
    const updatedPostTemplate = await PostTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPostTemplate) return res.status(404).json({ message: "PostTemplate not found" });
    res.status(200).json(updatedPostTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete PostTemplate
exports.deletePostTemplate = async (req, res) => {
  try {
    const deletedPostTemplate = await PostTemplate.findByIdAndDelete(req.params.id);
    if (!deletedPostTemplate) return res.status(404).json({ message: "PostTemplate not found" });
    res.status(200).json({ message: "PostTemplate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
