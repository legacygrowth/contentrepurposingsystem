const sysUserToken = require('../models/sysUserTokenModel');
const token = require('../utilities/jwtTokenService');


const createUserToken = async function(userId, email) {
  try {    
    var newToken = await token.createToken(Math.random().toString(), email);
    var newUserToken = new sysUserToken();
    newUserToken.userId = userId;
    newUserToken.token = newToken;
    newUserToken.isExpired = false;
    
    return await newUserToken.save();  
  } 
  catch (error) {
    return null;
  }
}

const getUserTokenByToken = async function(token) {
    console.log("check getUserToken");
  try{
        return await sysUserToken.findOne({token: token});       
    }
    catch (error) {
        return null;
    }
}

module.exports={createUserToken, getUserTokenByToken};