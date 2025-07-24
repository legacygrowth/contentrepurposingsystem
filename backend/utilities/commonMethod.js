const userService = require("../services/userService");
const userTokenService = require("../services/sysUserTokenService");
const agencyService = require("../services/agencyService");
const workSpaceService = require("../services/workspaceService");
const agencyUserService = require("../services/agencyUserService");
const workspaceUserService = require("../services/workspaceUserService");
const tempUserService = require("../services/tempUserService");

const GetUserDetailByToken = async function (token) {
  try {
    var existingUserToken = await userTokenService.getUserTokenByToken(token);
    
    if (existingUserToken && !existingUserToken.isExpired) {
      const isExpired = new Date(existingUserToken.expiredAt) < new Date();
      
      if (isExpired) {
                 return {        
            message: "Token is expired",
            userType: null,
            email: null,
            token,
            firstName: null,
            lastName: null,
            agencyName: null,
            workspaceName: null,
            agencyId: null,
            workspaceId: null,        
        };
      }
      
      var existingUser = await userService.getUserById(
        existingUserToken.userId
      );
      // if (!existingUser) {
      //   console.log("❌ User not found for token");
      //   return null;
      // }
      if (existingUser) {        
        var agencyUser = await agencyUserService.getAgencyUserByUserId(
          existingUser._id
        );
        
        var agencyName = null, workspaceName = null, agencyId = null, workspaceId = null;
        if (agencyUser) {
          
          var agency = await agencyService.getAgencyById(agencyUser.agencyId);
          
          if (agency) {
            agencyName = agency.name;
            agencyId = agency._id;
          }
        }
        const workspaceUser =
          await workspaceUserService.getWorkspaceUsersByUserId(
            existingUser._id
          );
        if (workspaceUser) {
          const workspace = await workSpaceService.getWorkspaceById(
            workspaceUser.workspaceId
          );
          if (workspace) {
            workspaceName = workspace.name;
            workspaceId = workspace._id;
          }
        }
      }
      return {        
          message: "Token is Verified",
          userType: "Existing user",
          email: existingUser.email,
          token: token,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          agencyName,
        workspaceName,
        agencyId,
        workspaceId       
      };
    } 
    else {      
      const tempUser = await tempUserService.getTempUserByToken(token);
      if (!tempUser) {
        console.log("❌ Temp user not found for token");    
        return {  
           
          message: "No record Found",
          userType: null,
          email: null,
          token,
          firstName: null,
          lastName: null,
          agencyName: null,
          workspaceName: null,
          agencyId: null,
          workspaceId: null,        
      };
      }
      const isExpired = new Date(tempUser.expiryDate) < new Date();
      if (isExpired) {
        console.log("⏰ Temp user token expired");
        return {
      
          message: "Token is Expired",
          userType: "New user",
          email: null,
          token,
          firstName: null,
          lastName: null,
          agencyName: null,
          workspaceName: null,
          token: token,
          firstName: null,
          lastName: null,
          agencyName: null,
          workspaceName: null,
          agencyId: null,
          workspaceId: null,
        };
      }
      
      return {
        message: "Token is Verified",
        userType: "New user",
        email: tempUser.email,
        token,
        firstName: null,
        lastName: null,
        agencyName: null,
        workspaceName: null,
        token: token,
        firstName: null,
        lastName: null,
        agencyName: null,
        workspaceName: null,
        agencyId: null,
        workspaceId: null,
      };
    }
  } catch (error) {
    console.log("Exception in the method");
    return null;
  }
};

module.exports = { GetUserDetailByToken };
