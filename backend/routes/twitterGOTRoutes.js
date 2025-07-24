const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMW");
const twitterController = require("../controllers/twitterGOTController");
const authenticateUserToken = require("../middleware/authMiddleware");

router.post("/login", twitterController.LoginToTwitter);
router.get("/callback", twitterController.TwitterCallback);
// router.post("/post", upload.array("media", 15), twitterController.Post);
router.post(
  "/post-with-media",
  upload.array("media", 4),
  twitterController.postWithMedia
);

module.exports = router;
