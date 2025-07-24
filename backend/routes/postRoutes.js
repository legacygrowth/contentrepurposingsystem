const express = require("express");
const router = express.Router();
const PostController = require("../controllers/postController");
const upload = require("../middleware/multerMW");
const authenticateUserToken = require("../middleware/authMiddleware");

// Post Routes
router.post("/create", upload.array("media", 15), PostController.createPost); // Create a new post
router.get("/getallposts", authenticateUserToken, PostController.getPosts); // Get all posts
router.get("/getposts/:id", authenticateUserToken, PostController.getPostById); // Get a post by ID
router.put(
  "/updateposts/:id",
  authenticateUserToken,
  PostController.updatePost
); // Update a post by ID
router.delete(
  "/deleteposts/:id",
  authenticateUserToken,
  PostController.deletePost
); // Delete a post by ID
module.exports = router;
