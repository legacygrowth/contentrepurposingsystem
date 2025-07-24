const workspaceTwitterAccount = require("../models/workspaceTwitterAccounts");

const insertWorkspaceTwitterAccount = async function (
  workspaceId,
  accountData
) {
  try {
    const newAccount = new workspaceTwitterAccount({
      workspaceId: workspaceId,
      twitterUserId: accountData.twitterUserId,
      twitterUserName: accountData.twitterUserName,
      accessToken: accountData.accessToken,
      refreshToken: accountData.refreshToken,
      expiresIn: accountData.expiresIn,
      profile: accountData.profile
    });

    const created = await newAccount.save();
    return created;
  } catch (error) {
    console.error("Error inserting Twitter account:", error.message);
    return null;
  }
};

const updateTwitterAccount = async function (
  id,
  accountData
) {
  try {
    const newAccount = await workspaceTwitterAccount.findByIdAndUpdate(id, {
      workspaceId: accountData.workspaceId,
      twitterUserId: accountData.twitterUserId,
      twitterUserName: accountData.twitterUserName,
      accessToken: accountData.accessToken,
      refreshToken: accountData.refreshToken,
      expiresIn: accountData.expiresIn,
      profile: accountData.profile
    });
    return newAccount;
  } catch (error) {
    console.error("Error inserting Twitter account:", error.message);
    return null;
  }
};

const getAllWorkspaceTwitterAccount = async function (workspaceId) {
  try {
    let accounts = await workspaceTwitterAccount.find({
      workspaceId: workspaceId,
    });
    return accounts;
  } catch (error) {
    return null;
  }
};

const getTwitterAccountById = async function (id) {
  try {
    let accounts = await workspaceTwitterAccount.findById(id);
    return accounts;
  } catch (error) {
    return null;
  }
};

module.exports = {
  insertWorkspaceTwitterAccount,
  getAllWorkspaceTwitterAccount,
  getTwitterAccountById,
  updateTwitterAccount,
};
