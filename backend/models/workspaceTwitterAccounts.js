const mongoose = require("mongoose");

const workspaceTwitterAccountSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  twitterUserId: {
    type: String,
  },
  twitterUserName: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  expiresIn: {
    type: Date,
  },
  profile:{
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const workspaceTwitterAccounts = mongoose.model(
  "workspaceTwitterAccounts",
  workspaceTwitterAccountSchema
);

module.exports = workspaceTwitterAccounts;
