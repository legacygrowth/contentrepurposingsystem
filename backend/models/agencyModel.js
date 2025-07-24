const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {type: mongoose.Schema.Types.ObjectId,  // 👈 Refers to ObjectId
      ref: 'sysUser'   },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  isPaymentVerified:{
    type: Boolean,
  } ,
});

module.exports = mongoose.model("agencies", agencySchema, "agencies");
