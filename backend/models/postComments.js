const mongoose = require("mongoose");

const postCommentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sysUserModel",
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postModel",
  },
  comments:{
 type:String
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "postComments",
  postCommentsSchema,
  "postComments"
);
