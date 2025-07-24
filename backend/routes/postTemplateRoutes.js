const express = require('express');
const router = express.Router();
const postTemplateController = require('../controllers/postTemplateController');

// Get all post templates
router.get('/getAllPostTemplates', postTemplateController.getAllPostTemplates);

// Get post template by ID
router.get('/getPostTemplate/:id', postTemplateController.getPostTemplateById);

// Add new post template
router.post('/addPostTemplate', postTemplateController.addPostTemplate);

// Update post template by ID
router.put('/updatePostTemplate/:id', postTemplateController.updatePostTemplate);

// Delete post template by ID
router.delete('/deletePostTemplate/:id', postTemplateController.deletePostTemplate);

module.exports = router;
