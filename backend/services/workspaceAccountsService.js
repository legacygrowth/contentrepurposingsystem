const WorkspaceAccount = require("../models/workspaceAccounts");
const mongoose = require("mongoose");

const createWorkspaceAccount = async (WorkspaceData) => {
  const workspaceAccounts = new WorkspaceAccount(WorkspaceData);
  return await workspaceAccounts.save();
};

const getWorkspaceAccountByWorkspaceId = async (workspaceId) => {
  return await WorkspaceAccount.find({ workSpaceID: workspaceId });
};

const getWorkspaceAccountById = async (accountId) => {
  return await WorkspaceAccount.findById(accountId);
};

const getAgencyNewAccount = async function (agencyID, platform, workspaceId, userId) {
  
  return await WorkspaceAccount.findOne({
    agencyID: agencyID,
    platform: platform,
    workSpaceID: workspaceId,
    userId: userId,
    code: "New"
  }).sort({ createdAt: -1 });
};

const createOrUpdateTwitterAccount = async (accountData) => {
  const { 
    userId,   
    platform,
    accessToken,
    accessSecret,
    refreshToken,
    expiresIn,
    twitterHandle,
    authorUrn,
    oauthToken,
    oauthTokenSecret, //for testing
    oauthVerifier,
    agencyID,
    workSpaceID,
    code,
    state
  } = accountData;
  try {
    
    let existing = await WorkspaceAccount.findOne({
      platform: platform,
      agencyID: agencyID,
      workspaceID: workSpaceID,
      userId: userId,
      Code: "New",
    }).sort({ createdAt: -1 });


    if(existing){
      const updatedRecord = await WorkspaceAccount.findByIdAndUpdate(existing._id, {
        userId: existing.userId,   
        platform: existing.platform,
        accessToken: existing.accessToken,
        accessSecret: existing.accessSecret,
        refreshToken: existing.refreshToken,
        expiresIn: existing.expiresIn,
        twitterHandle: existing.twitterHandle,
        authorUrn: existing.authorUrn,
        oauthToken: existing.oauthToken,
        oauthTokenSecret: existing.oauthTokenSecret, //for testing
        oauthVerifier: existing.oauthVerifier,
        agencyID: existing.agencyID,
        workSpaceID: existing.workSpaceID,
        code: code,
        state: existing.state
      });

      return {
        message: "Twitter account updated successfully",
        account: updatedRecord,
      };
    }else{
      // Create new
      const newAccount = new WorkspaceAccount({
        platform,
        userId: userId,
        accessToken,
        accessSecret,
        refreshToken,
        expiresIn,
        twitterHandle,
        authorUrn,
        oauthToken,
        oauthTokenSecret, ///for testing
        oauthVerifier,
        appId: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        agencyID,
        workSpaceID,
        code: code,
        state: state,
      });
      const newCreatedAccount = await newAccount.save();
      return {
        message: "Twitter account saved successfully",
        account: newCreatedAccount,
      };
    }
  } catch (error) {
    console.error(":x: Error saving Twitter account:", error.message);
    throw new Error("Failed to save Twitter account");
  }
};
module.exports = {
  createWorkspaceAccount,
  getWorkspaceAccountByWorkspaceId,
  createOrUpdateTwitterAccount,
  getWorkspaceAccountById,
  getAgencyNewAccount,
};

// Old workspcae Accounts Service

// const WorkspaceAccount = require('../models/workspaceAccounts');
// const createWorkspaceAccount = async (WorkspaceData) => {
//   const workspaceAccounts = new WorkspaceAccount(WorkspaceData);
//   return await workspaceAccounts.save();
// };
// const getWorkspaceAccountByWorkspaceId = async (workspaceId) => {
//   return await WorkspaceAccount.find({workSpaceID: workspaceId});
// };
// module.exports = {
//   createWorkspaceAccount,
//   getWorkspaceAccountByWorkspaceId,
// };