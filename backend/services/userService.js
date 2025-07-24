const sysUser = require("../models/sysUserModel");
const bcrypt = require("bcryptjs");

const createUser = async function (
  email,
  firstName,
  lastName,
  password,
  address,
  city,
  state,
  zipCode,
  country
) {
  try {
    console.log("Adding User");

    const hashedPassword = await bcrypt.hash(password, 10); //  HASH password here
    const newSysUser = new sysUser();

    newSysUser.firstName = firstName;
    newSysUser.lastName = lastName;
    newSysUser.email = email;
    newSysUser.password = hashedPassword;
    newSysUser.address = address;
    newSysUser.city = city;
    newSysUser.state = state;
    newSysUser.zipcode = zipCode;
    newSysUser.country = country;
    newSysUser.isActive = true;
    newSysUser.failedLoginAttempts = 0;
    newSysUser.isBlocked = false;
    newSysUser.isPaymentVerified = false;

    let user = await newSysUser.save();
    console.log("User is added");
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const loginUser = async function (email, password) {
  try {
    const user = await sysUser.findOne({ email });
    if (!user) {
      console.error("User not found");
      return null;
    }
    if (user.isBlocked) {
      console.error("User is blocked");
      return null;
    }
    const isVerifiedUser = await bcrypt.compare(password, user.password);
    if (isVerifiedUser) {
      console.log("User logged in successfully");
      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getUserByEmail = async function (email) {
  try {
    return await sysUser.findOne({ email });
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getAllUsers = async function () {
  try {
    return await sysUser.find({});
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserById = async function (id) {
  try {
    return await sysUser.findById(id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updatePasswordById = async function (id, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await sysUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateUserDetailsById = async function (id, userDetails) {
  try {
    return await sysUser.findByIdAndUpdate(id, userDetails, { new: true });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const agencies = async function (id) {
  try {
    return await sysUser.findById(id).populate("agencies");
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updatePasswordById,
  updateUserDetailsById,
  agencies,
};
