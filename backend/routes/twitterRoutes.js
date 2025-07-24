const express = require('express');
const router = express.Router();
const twitterController = require('../controllers/twitterController');

// Twitter Routes
router.post('/post-text', twitterController.postTextOnTwitter);
router.post('/post-image-url', twitterController.postImageFromURLOnTwitter);
router.post('/post-image-file', twitterController.postImageFromFileOnTwitter);
router.post('/post-video', twitterController.postVideoOnTwitter);
 

module.exports = router;