const mongoose = require("mongoose");
const socialMediaAccountsSchema = new mongoose.Schema({
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
  accessToken: {
    type: String,
  },
  clientId: {
    type: String,
  },
  clientSecret: {
    type: String,
  },
  userAccessToken: {
    type: String,
  },
  pageId: {
    type: String,
  },
  agencyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agencies",
    required: true,
  },
  workSpaceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspaces",
    required: true,
  },
  apiKey: {
    type: String,
  },
  apiSecret: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model(
  "socialMediaAccounts",
  socialMediaAccountsSchema,
  "socialMediaAccounts"
);

// Old Social Media Account Model

// const mongoose = require("mongoose");
// const socialMediaAccountsSchema = new mongoose.Schema({
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
//   agencyID:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"agencies",
//     required:true
//   },
// workSpaceID:{
//   type:mongoose.Schema.Types.ObjectId,
//   ref:"workspaces",
//   required:true,
// },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });
// module.exports = mongoose.model(
//   "socialMediaAccounts",
//   socialMediaAccountsSchema,
//   "socialMediaAccounts"
// );