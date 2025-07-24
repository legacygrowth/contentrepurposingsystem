// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   profile: { type: Object, required: true },
//   googleId: { type: String, default: null },
//   facebookId: { type: String, default: null }
// }, { timestamps: true });

// module.exports = mongoose.model('UserDetails', userSchema, 'UserDetails');




const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: String,
  profile: Object,
  googleId: String,
});

module.exports = mongoose.model('UserDetails', userSchema, 'UserDetails');
