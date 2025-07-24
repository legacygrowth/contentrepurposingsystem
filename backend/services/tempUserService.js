const SysTempUser = require("../models/sysTempUser");
const token = require("../utilities/jwtTokenService");

const createTempUser = async function (email) {
  try {
    console.log("check Create Temp User email");
    var newToken = await token.createToken(Math.random().toString(), email);
    const existingUser = await SysTempUser.findOne({ email: email });
    console.log("check the exisiting user");

    if (existingUser) {
      return await SysTempUser.findByIdAndUpdate(
        existingUser._id,
        {
          token: newToken,
          expiryDate: new Date(Date.now() + 10 * 60 * 1000),
          isExpired: false,
        },
        { new: true }
      );
      return await tempUser.save();
    } else {
      console.log("check sysTemp");
      const tempUser = new SysTempUser();
      tempUser.email = email;
      tempUser.token = newToken;
      tempUser.expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
      return await tempUser.save();
    }
  } catch (error) {
    throw new Error("Error creating temporary user: " + error.message);
  }
};

const getTempUserByToken = async function (token) {
  console.log("check getUserToken");
  try {
    return await SysTempUser.findOne({ token: token });
  } catch (error) {
    throw new Error("Error retrieving temporary user: " + error.message);
  }
};

const createUserFromTempToken = async function (token) {
  // Token TempUser
  const tempUser = await getTempUserByToken(token);
  if (!tempUser) {
    throw new Error("Invalid token: No temp user found");
  }
  // Expiry check karo
  const isExpired = new Date(tempUser.expiryDate) < new Date();
  if (isExpired) {
    throw new Error("Token expired");
  }
  const email = tempUser.email;

  // Need to import userService
  const userService = require("./userService");
  const userTokenService = require("./userTokenService");

  // Check karo user already exist to nahi karta
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }
  // New user create karo
  const newUser = await userService.createUser({
    email: email,
  });
  const userToken = await userTokenService.createUserToken(
    newUser._id,
    newUser.email
  );

  return { newUser, token: userToken.token };
};

module.exports = {
  createTempUser,
  getTempUserByToken,
  createUserFromTempToken,
};
