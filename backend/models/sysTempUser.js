const mongoose = require('mongoose');

const  sysTempUserSchema = new mongoose.Schema({
  email: {  
    type: String,
    required: true,
  },
  token:{
    type: String,
    required: true,
  },
  expiryDate:{
    type: Date,
    required: true,
  },
  isExpired:{
    type: Boolean,
    default: false,
  },
})

  module.exports = mongoose.model('SysTempUser', sysTempUserSchema, 'SysTempUser');
