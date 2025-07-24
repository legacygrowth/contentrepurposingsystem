const express = require("express");
const router = express.Router();
const PostCommentsController = require("../controllers/postCommentController");

const insertComment = PostCommentsController.insertComment;
const deleteCommentById = PostCommentsController.deleteCommentById;
const getCommentsByPostId = PostCommentsController.getCommentByPostId;

router.post("/createComment", insertComment);
router.delete("/deleteComment/:id", deleteCommentById);
router.get("/getCommentByPostId/:postId", getCommentsByPostId);

module.exports = router;
