const mongoose = require("mongoose");
const userService = require("../services/userService");
const workspaceService = require("../services/workspaceService");
const tokenService = require("../services/tokenService");
const userTokenService = require("../services/sysUserTokenService");
const workspaceUserService = require("../services/workspaceUserService");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const emailService = require("../utilities/emailService");
const autoGenerate = require("../utilities/autoGenerateNameService");
const file = require("../utilities/fileReadService");
const axios = require("axios");
const commonMethod = require("../utilities/commonMethod");
exports.signUpWithEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (user) return res.status(400).json({ message: "Email already exists" });

    const newWorkeSpace = await workspaceService.createWorkspace(
      await autoGenerate.enterpriseName(),
      null
    );
    const person = await autoGenerate.randomPerson();
    const location = await autoGenerate.randomLocation();
    const randomPassword = await autoGenerate.randomPassword();

    const newSysUser = await userService.createUser(
      email,
      person.firstName(),
      person.lastName(),
      randomPassword,
      location.streetAddress(),
      location.city(),
      location.state(),
      location.zipCode(),
      location.country()
    );

    if (newWorkeSpace && newSysUser) {
      await workspaceUserService.createWorkspaceUser(
        newWorkeSpace._id,
        newSysUser._id,
        "Sys Admin"
      );
    }

    if (newSysUser && newSysUser._id) {
      const token = await tokenService.createToken(newSysUser._id, email);
      let htmlFile = await file.readFileFromPath(
        "../emailtemplates/senduserlink.html"
      );
      htmlFile = htmlFile
        .replace("{userToken}", token.token)
        .replace("{email}", email);

      await emailService.sendEmail(email, "Your sign-in link", htmlFile);
    }

    res.status(200).json({ message: "SignUp successful", newSysUser });
  } catch (err) {
    res.status(500).json({ message: "SignUp error", error: err.message });
  }
};
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser(email, password);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    var userToken = await userTokenService.createUserToken(
      user._id,
      user.email
    );

    if (userToken) {
      const data = await commonMethod.GetUserDetailByToken(userToken.token);
      return res.status(200).json({ data });
    } else {
      return res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
exports.updatePassword = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ message: "Invalid id" });
  }

  const { password } = req.body;

  try {
    const updatedUser = await userService.updatePasswordById(userId, password);
    if (!updatedUser)
      return res.status(400).json({ message: "User Not Found" });

    res
      .status(200)
      .json({ message: "Password updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ message: "Invalid id" });
  }

  const { firstName, lastName, email, address, city, state, zipCode, country } =
    req.body;

  const userDetails = {
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    zipcode: zipCode,
    country,
  };

  try {
    const updatedUser = await userService.updateUserDetailsById(
      userId,
      userDetails
    );
    if (!updatedUser)
      return res.status(400).json({ message: "User Not Found" });

    res
      .status(200)
      .json({ message: "User details updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};
exports.getAllUserDetails = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifytoken = async (req, res) => {
  const paramToken = req.query.token;

  try {
    const userToken = await tokenService.getTokenByToken(paramToken);
    if (!userToken) return res.status(400).json({ message: "Invalid token" });

    const now = new Date();
    if (userToken.expiredAt <= now)
      return res.status(400).json({ message: "Token Expired" });

    const user = await userService.getUserById(userToken.userId);
    if (!user) return res.status(400).json({ message: "User Not Found" });

    res.status(200).json({ message: "Token Verified and user fetched", user });
  } catch (err) {
    res.status(500).json({ message: "Token error", error: err.message });
  }
};
exports.googleLoginWithToken = async (req, res) => {
  const { token } = req.body;
  console.log("Received Google token:", token ? "Token present" : "No token");

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google token verified, payload:", payload);
    const { email, given_name, family_name, sub } = payload;

    let user = await userService.getUserByEmail(email);

    if (!user) {
      console.log("Creating new user for Google login");
      user = await userService.createUser(
        email,
        given_name,
        family_name || "",
        "",
        "",
        "",
        "",
        "",
        ""
      );
      user.googleId = sub;
    } else {
      console.log("Updating existing user for Google login");
      if (!user.googleId) {
        user.googleId = sub;
      }
    }

    await user.save();
    res.status(200).json({ message: "Google Login Success", user });
  } catch (err) {
    console.error("Google login error:", err);
    res
      .status(500)
      .json({ message: "Google Login Failed", error: err.message });
  }
};
exports.facebookLoginWithToken = async (req, res) => {
  const { accessToken } = req.body;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
    );
    const { id, name, email, picture } = response.data;

    let user = await userService.getUserByEmail(email);

    if (!user) {
      const [firstName, lastName] = name.split(" ");
      user = await userService.createUser(
        email,
        firstName,
        lastName,
        "",
        "",
        "",
        "",
        "",
        ""
      );
      user.facebookId = id;
      user.profilePicture = picture.data.url;
    } else {
      if (!user.facebookId) {
        user.facebookId = id;
        user.profilePicture = picture.data.url;
      }
    }

    await user.save();
    res.status(200).json({ message: "Facebook Login Success", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Facebook Login Failed", error: err.message });
  }
};
exports.getAllWorkspaceByUserId = async (req, res) => {
  const userId = req.query.userId;

  try {
    // Get all workspace-user relations for this user
    const workspaceUsers =
      await workspaceUserService.getAllWorkspacesUsersByUserId(userId);

    console.log("✅ Found workspaceUsers:", workspaceUsers);

    return res.status(200).json({ workspaceUsers });
  } catch (error) {
    console.error("❌ Error getting workspace names by userId:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.GetUserDetailByToken = async (req, res) => {
  const { token } = req.body;
  try {
    const data = commonMethod.GetUserDetailByToken(token);
    return res.status(500).json({ data });
  } catch (error) {
    console.error("GetUserDetailByToken error:", error);
    return res.status(500).json({
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};
