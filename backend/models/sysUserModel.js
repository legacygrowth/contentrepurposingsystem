const mongoose = require("mongoose");
const userTypes = require("./userTypes");

const sysUser = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: false, unique: true, sparse: true }, //AHsan Added sparse true and required set to false so existin record will not be added
  password: String,
  phoneNo: String,
  companyName: String,
  address: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  isActive: Boolean,
  // FOR CALLBACK DATA
  twitterUserName: String,
  accessToken: String,
  refreshToken: String,
  description: String,
  twitterJoinedAt: Date,

  failedLoginAttempts: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer",
    },
  },
  isBlocked: Boolean,
  
  userTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userTypes",
  },
});

module.exports = mongoose.model("sysUser", sysUser, "sysUser");
