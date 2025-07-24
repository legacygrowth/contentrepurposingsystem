const mongoose = require('mongoose');

const postTemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const PostTemplate = mongoose.model('PostTemplate', postTemplateSchema,"PostTemplate");

module.exports = PostTemplate;
