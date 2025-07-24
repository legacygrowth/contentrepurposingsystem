const express = require("express");
const router = express.Router();
const twitterOAuthController = require("../controllers/twitterOAuthController");
// Use the correct function name here
router.get("/auth/twitter", twitterOAuthController.getTwitterAuthLink);
router.get("/auth/twitter/callback",  twitterOAuthController.handleTwitterCallback);
module.exports = router;
