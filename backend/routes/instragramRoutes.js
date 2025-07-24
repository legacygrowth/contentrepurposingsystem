const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

router.post('/post-text', instagramController.postTextOnInstagram);
router.post('/post-image-url', instagramController.postImageFromURLOnInstagram);
router.post('/post-image-file', instagramController.postImageFromFileOnInstagram);
router.post('/post-video', instagramController.postVideoOnInstagram);

module.exports = router;
