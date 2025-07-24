const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const createToken = async function (id, email){
  const user = { id: id, email: email };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

module.exports = { createToken };