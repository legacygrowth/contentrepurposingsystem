const mongoose = require("mongoose");

const userTypesSchema = new mongoose.Schema({
  usertypes: {
    type: String,
    required: true,
  },
  userId: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "sysUser",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userTypes", userTypesSchema, "userTypes");
