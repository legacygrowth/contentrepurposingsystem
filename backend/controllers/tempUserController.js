const tempUserService = require("../services/tempUserService");
const userService = require("../services/userService");
const userTokenService = require("../services/sysUserTokenService");
const agencyService=require("../services/agencyService")
const workSpaceService=require("../services/workspaceService")
const agencyUserService=require("../services/agencyUserService")
const workspaceUserService=require("../services/workspaceUserService")

const commonMethod =require("../utilities/commonMethod")

const emailService = require("../utilities/emailService");
const file = require("../utilities/fileReadService");
require("dotenv").config();

async function sendSignUpEmail(tokenString, emailString) {
  console.log("Reading html file");
  let htmlFile = await file.readFileFromPath(
    "../emailtemplates/senduserlink.html"
  );
  console.log("Replacing data in html file");
  htmlFile = htmlFile.replace("{FRONT-END-URL}", process.env.FRONTEND_URL);
  htmlFile = htmlFile.replace("{userToken}", tokenString);
  htmlFile = htmlFile.replaceAll("{email}", emailString);  
  htmlFile = htmlFile.replaceAll("{company}", process.env.COMPANY_NAME);  
  console.log(htmlFile);
  


  console.log("Sending email");
  var emailSent = await emailService.sendEmail(
    emailString,
    "Your sign-in link",
    htmlFile
  );
  if (emailSent) {
    console.log("email sent");
    return true;
  } else {
    console.log("Error while sending email");
    return false;
  }
}

exports.signup = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    var existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      var userToken = await userTokenService.createUserToken(
        existingUser._id,
        existingUser.email
      );
      var emailSent = sendSignUpEmail(userToken.token, email);
      return res.status(201).json({
        message: "User token is created for login",
        token: userToken.token,
      });
    } else {
      console.log("Creating temporary user with email:", email);
      const tempUser = await tempUserService.createTempUser(email);
      var emailSent = sendSignUpEmail(tempUser.token, email);
      return res.status(201).json({
        message: "Temp User token is created for signup",
        token: tempUser.token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {  
  const { token } = req.query;  
  console.log(token);
  
  try {
    var data = await commonMethod.GetUserDetailByToken(token);
    return res.status(200).json({data});    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.registerUserFromToken = async (req, res) => {
 const {
    token,
    firstName,
    lastName,
    password,
    agencyname,
    workspaceName,
    streetAddress,
    city,
    state,
    zipCode,
    country,
  } = req.body;

  try {
    const tempUser = await tempUserService.getTempUserByToken(token);
    

    if (!tempUser) {
      return res.status(404).json({ message: "Invalid token" });
    }

    if (tempUser.isExpired || new Date(tempUser.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }
    const email = tempUser.email;
    const existingUser = await userService.getUserByEmail(email );
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await userService.createUser(  
       email,
      firstName,
      lastName,
      password,
      streetAddress,
      city,
      state,
      zipCode,
      country);
 
if (newUser) {
  const newAgency = await agencyService.createAgency(agencyname, newUser._id);
  console.log("New agency created:", newAgency);

  let newWorkSpace; 

  if (newAgency) {
    newWorkSpace = await workSpaceService.createWorkspace(workspaceName, newAgency._id);
    console.log("New workspace created:", newWorkSpace);
  }

  if (newUser && newAgency) {
    const agencyAdmin = "agency admin";
    const agencyUser = await agencyUserService.createAgencyUser(newAgency._id, newUser._id, agencyAdmin);
  }

  if (newUser && newWorkSpace) {
    
    const isPrimary=true;
    const workspaceUser = await workspaceUserService.createWorkspaceUser(newWorkSpace._id, newUser._id,isPrimary);
  }
   if (newUser && newAgency && newWorkSpace){
    const isExpired=false
    const sysUserToken=await userTokenService.createUserToken(newUser._id, newUser.email);

    return res.status(201).json({
      message: "User successfully created from token",
      UserID: newUser._id,
      email: newUser.email,
      token:sysUserToken.token,
      agencyName:agencyname,
      workspacename:workspaceName,
      agencyId:newAgency._id,
      workspaceId:newWorkSpace._id

    });
   }

} 
       
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

