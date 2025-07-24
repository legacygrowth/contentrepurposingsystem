const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  planning: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  platform: {
    type: String,
    required: true,
  },
  platformId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  labels: {
    type: String,
  },
  notes: {
    type: String,
    default: "",
  },
  boostBudget: {
    type: Number,
    default: 0,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  postMedia: {
    type: [String],
  },
  approvalStatus: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sysUser",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema, "posts");
