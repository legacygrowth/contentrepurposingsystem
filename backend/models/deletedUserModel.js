const mongoose = require('mongoose');

const sysDeletedUser = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: String,
  phoneNo: String,
  companyName: String,
  address: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  
  
});

module.exports = mongoose.model('sysDeletedUser', sysDeletedUser, 'sysDeletedUser');