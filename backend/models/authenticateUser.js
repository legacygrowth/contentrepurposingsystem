const mongoose = require('mongoose');

const authenticateUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuthenticateUser', authenticateUserSchema, 'authenticateUsers');

