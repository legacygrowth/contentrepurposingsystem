const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // 👈 Refers to ObjectId
    ref: "sysUser",
  },
  agencyId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"agencies"
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workspace", workspaceSchema, "workspaces");
  