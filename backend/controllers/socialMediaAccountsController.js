const SocialMediaAccount = require("../models/socialMediaAccounts");
const facebookService = require("../services/facebookService");

const createSocialMediaAccount = async (req, res) => {
  try {
    const accountData = req.body;
    
    const newAccount = new SocialMediaAccount(accountData);
    const savedAccount = await newAccount.save();

    res.status(201).json(savedAccount);
  } catch (error) {
    console.error("Error creating social media account:", error);
    res.status(500).json({
      error: "Failed to create social media account",
      details: error.message,
    });
  }
};

const getSocialMediaAccounts = async (req, res) => {
  try {
    const accounts = await SocialMediaAccount.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching social media accounts:", error);
    res.status(500).json({
      error: "Failed to fetch social media accounts",
      details: error.message,
    });
  }
};
const getSocialMediaAccountById = async (req, res) => {
  try {
    const account = await SocialMediaAccount.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        details: "No social media account found with the provided ID",
      });
    }
    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching social media account:", error);
    res.status(500).json({
      error: "Failed to fetch social media account",
      details: error.message,
    });
  }
};
const updateSocialMediaAccount = async (req, res) => {
  try {
    const updatedAccount = await SocialMediaAccount.findByIdAndUpdate(
      req.params.accountId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({
        error: "Account not found",
        details: "No social media account found with the provided ID",
      });
    }
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error("Error updating social media account:", error);
    res.status(500).json({
      error: "Failed to update social media account",
      details: error.message,
    });
  }
};
const deleteSocialMediaAccount = async (req, res) => {
  try {
    const deletedAccount = await SocialMediaAccount.findByIdAndDelete(
      req.params.accountId
    );
    if (!deletedAccount) {
      return res.status(404).json({
        error: "Account not found",
        details: "No social media account found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Social media account deleted successfully",
      id: req.params.accountId,
    });
  } catch (error) {
    console.error("Error deleting social media account:", error);
    res.status(500).json({
      error: "Failed to delete social media account",
      details: error.message,
    });
  }
};
module.exports = {
  createSocialMediaAccount,
  getSocialMediaAccounts,
  getSocialMediaAccountById,
  updateSocialMediaAccount,
  deleteSocialMediaAccount,
};
