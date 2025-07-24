const sysUserToken = require('../models/sysUserTokenModel');
const token = require('../utilities/jwtTokenService');

const createToken = async function (userId, email ){
  
  try {
    console.log("Adding Token");
    var sysToken = new sysUserToken();
    sysToken.userId = userId;
    sysToken.token = await token.createToken(userId.toString(), email);
    sysToken.isExpired = false;
    sysToken.expiredAt = new Date(Date.now() + 10 * 60000);
    let createdToken = await sysToken.save();
    console.log("Token is added");
      return createdToken;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}

const getTokenByToken = async function (userToken){
  
  try {
    console.log("Getting token details");
    let getToken = await sysUserToken.findOne({ token: userToken });
    
    console.log("Returning token details");
    return getToken;
    
  } catch (err) {
    console.error(err);  
    return null;
  }
}

module.exports = { createToken, getTokenByToken };