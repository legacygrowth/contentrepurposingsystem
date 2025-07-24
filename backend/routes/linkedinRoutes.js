const express = require('express');
const router = express.Router();
const linkedinController = require('../controllers/linkedinController');


router.post('/post-text', linkedinController.postTextOnLinkedIn);
router.post('/post-image-url', linkedinController.postImageFromURLOnLinkedIn);
router.post('/post-image-file', linkedinController.postImageFromFileOnLinkedIn);
router.post('/post-video', linkedinController.postVideoOnLinkedIn);

module.exports = router;