const mongoose = require("mongoose");
const workspaceAccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  appId: {
    type: String,
  },
  appSecret: {
    type: String,
  },
  pageId: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  accessSecret: {
    type: String,
  },
  tokenIssuedAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
  },
  expiresIn: {
    type: Number,
  },
  userAccessToken: {
    type: String,
  },
  profileData: {
    type: Object,
  },
  oauthToken: {
    type: String,
  },
  oauthVerifier: {
    type: String,
  },
  authorUrn: {
    type: String,
  },
  state: {
    type: String,
  },
  code: {
    type: String,
  },
  twitterHandle: {
    type: String,
  },
  workSpaceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspaces",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  agencyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agencies",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model(
  "WorkspaceAccount",
  workspaceAccountSchema,
  "workspaceAccounts"
);


// Old workspcae Accounts Model

// const mongoose = require('mongoose');
// const workspaceAccountSchema = new mongoose.Schema({
//   platform: {
//     type: String,
//     required: true,
//   },
//   appId: {
//     type: String,
//   },
//   appSecret: {
//     type: String,
//   },
//   accessToken: {
//     type: String,
//   },
//   userAccessToken: {
//     type: String,
//   },
//   pageId: {
//     type: String,
//   },
//   profileData: {
//     type: Object,
//   },
//   workSpaceID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "workspaces",
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });
// module.exports = mongoose.model('WorkspaceAccount', workspaceAccountSchema, 'workspaceAccounts');//name,schema,collection