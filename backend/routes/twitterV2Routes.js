const express = require('express');
const router = express.Router();
const upload = require("../middleware/multerMW");
const twitterController = require('../controllers/TwitterV2Controller');
const authenticateUserToken = require("../middleware/authMiddleware");

// Twitter Routes
router.get('/Login', twitterController.LoginToTwitter);
router.get('/callback', twitterController.CallBackFromTwitter);
router.post('/post',  upload.array("media", 15), twitterController.PostToTwiiter);
 

module.exports = router;