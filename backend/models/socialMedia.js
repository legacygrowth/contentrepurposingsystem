const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  platform: { 
    type: String, 
    required: true,  
  },
  profileData: {
    type: Object,
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema, 'SocialMedia');
