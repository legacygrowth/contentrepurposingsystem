const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaConfigrationController');

// Get all social media configurations
router.get('/getallSocialmedia', socialMediaController.getAllSocialMedia);

// Create a new social media configuration
router.post('/createSocialmedia', socialMediaController.createSocialMedia);

// Update social media configuration by ID
router.put('/updateSocialm:id', socialMediaController.updateSocialMedia);

// Delete social media configuration by ID
router.delete('/deleteSocialm:id', socialMediaController.deleteSocialMedia);

module.exports = router;
