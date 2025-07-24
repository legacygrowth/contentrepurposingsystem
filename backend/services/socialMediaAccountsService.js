const SocialMediaAccount = require("../models/socialMediaAccounts");
const mongoose = require("mongoose");

const createSocialMediaAccount = async function (accountData) {
  try {
    const newAccount = new SocialMediaAccount(accountData);
    const savedAccount = await newAccount.save();
    return savedAccount;
  } catch (error) {
    console.error("Error creating social media account:", error.message);
    throw new Error("Failed to create social media account");
  }
};

const getSocialMediaAccounts = async function () {
  return await SocialMediaAccount.find();
};

const getSocialMediaAccountById = async function (accountId) {
  return await SocialMediaAccount.findById(accountId);
};

const getSocialMediaAccountByPageId = async function (pageId) {
  return await SocialMediaAccount.findOne({
    pageId: pageId,
    platform: "facebook",
  });
};

const getAgencyAccountByPlatform = async function (agencyID, platform) {
  return await SocialMediaAccount.findOne({
    agencyID: agencyID,
    platform: platform,
  });
};



const updateSocialMediaAccount = async function (accountId, accountData) {
  return await SocialMediaAccount.findByIdAndUpdate(accountId, accountData, {
    new: true,
    runValidators: true,
  });
};

const deleteSocialMediaAccount = async function (accountId) {
  await SocialMediaAccount.findByIdAndDelete(accountId);
  return { message: "Social media account deleted successfully" };
};

const createOrUpdateTwitterAccount = async function (accountData) {
  const {
    userId,
    platform,
    accessToken,
    refreshToken,
    expiresIn,
    twitterHandle,
    authorUrn,
    agencyID,
    workSpaceID,
  } = accountData;
  try {
    console.log(":small_blue_diamond: Received accountData:", accountData);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(
        "Invalid userId provided — must be a valid MongoDB ObjectId."
      );
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    let existing = await SocialMediaAccount.findOne({
      platform: "twitter",
      authorUrn: authorUrn,
    });
    let savedAccount;
    if (existing) {
      existing.accessToken = accessToken;
      existing.refreshToken = refreshToken;
      existing.expiresIn = expiresIn;
      existing.twitterHandle = twitterHandle;
      existing.userId = objectId;
      existing.agencyID = agencyID;
      existing.workSpaceID = workSpaceID;
      savedAccount = await existing.save();
    } else {
      const newAccount = new SocialMediaAccount({
        platform,
        userId: objectId,
        accessToken,
        refreshToken,
        expiresIn,
        twitterHandle,
        authorUrn,
        appId: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        agencyID,
        workSpaceID,
      });
      savedAccount = await newAccount.save();
    }
    // :white_check_mark: Return the whole saved document including _id
    return {
      message: "Twitter account saved successfully",
      account: savedAccount, // :point_left: yeh object me _id bhi included hoga
    };
  } catch (error) {
    console.error(":x: Error saving Twitter account:", error.message);
    throw new Error("Failed to save Twitter account");
  }
};
module.exports = {
  createSocialMediaAccount,
  getSocialMediaAccounts,
  getSocialMediaAccountById,
  getSocialMediaAccountByPageId,
  updateSocialMediaAccount,
  deleteSocialMediaAccount,
  createOrUpdateTwitterAccount,
  getAgencyAccountByPlatform,
  
};


// Old Social Media Accounts Service

// const SocialMediaAccount = require("../models/socialMediaAccounts");
// const createSocialMediaAccount = async function (accountData) {
//   try {
//     const newAccount = new SocialMediaAccount(accountData);
//     const savedAccount = await newAccount.save();
//     return savedAccount;
//   } catch (error) {
//     console.error("Error creating social media account:", error.message);
//     throw new Error("Failed to create social media account");
//   }
// };
// const getSocialMediaAccounts = async function () {
//   return await SocialMediaAccount.find();
// };
// const getSocialMediaAccountById = async function (accountId) {
//   return await SocialMediaAccount.findById(accountId);
// };
// const getSocialMediaAccountByPageId = async function (pageId) {
//   return await SocialMediaAccount.findOne({
//     pageId: pageId,
//     platform: "facebook",
//   });
// };
// const updateSocialMediaAccount = async function (accountId, accountData) {
//   return await SocialMediaAccount.findByIdAndUpdate(accountId, accountData, {
//     new: true,
//     runValidators: true,
//   });
// };
// const deleteSocialMediaAccount = async function (accountId) {
//   await SocialMediaAccount.findByIdAndDelete(accountId);
//   return { message: "Social media account deleted successfully" };
// };
// module.exports = {
//   createSocialMediaAccount,
//   getSocialMediaAccounts,
//   getSocialMediaAccountById,
//   getSocialMediaAccountByPageId,
//   updateSocialMediaAccount,
//   deleteSocialMediaAccount,
// };