const twitterService = require("../services/twitterService");
const SocialAccount = require("../models/socialMediaAccounts");
// :wrench: Get dynamic credentials
const getTwitterCredentials = async (platformId) => {
  const account = await SocialAccount.findById(platformId);
  if (!account) throw new Error("Twitter account not found");
  return {
    appKey: account.appKey,
    appSecret: account.appSecret,
    accessToken: account.accessToken,
    accessSecret: account.accessSecret,
  };
};
// :large_green_circle: 1. Text-only tweet
exports.postTextOnTwitter = async (req, res) => {
  const { message, platformId } = req.body;
  try {
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }
    const credentials = await getTwitterCredentials(platformId);
    const postId = await twitterService.postTextToTwitter(message, credentials);
    res.json({ success: true, postId });
  } catch (error) {
    console.error("Error posting text on Twitter:", error.message);
    res.status(500).json({ error: error.message || "Failed to post text" });
  }
};
// :large_blue_circle: 2. Image file upload
exports.postImageFromFileOnTwitter = async (req, res) => {
  const { message, platformId } = req.body;
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ error: "No image file provided" });
  }
  try {
    const credentials = await getTwitterCredentials(platformId);
    const postId = await twitterService.postImageToTwitter(
      message,
      imageFile.path,
      credentials
    );
    res.json({ success: true, postId });
  } catch (error) {
    console.error("Error posting image from file on Twitter:", error);
    res.status(500).json({ error: error.message || "Failed to post image" });
  }
};
// :large_purple_circle: 3. Video upload
exports.postVideoOnTwitter = async (req, res) => {
  const { message, platformId } = req.body;
  const videoFile = req.file;
  if (!videoFile) {
    return res.status(400).json({ error: "No video file provided" });
  }
  try {
    const credentials = await getTwitterCredentials(platformId);
    const postId = await twitterService.postVideoToTwitter(
      message,
      videoFile.path,
      credentials
    );
    res.json({ success: true, postId });
  } catch (error) {
    console.error("Error posting video on Twitter:", error);
    res.status(500).json({ error: error.message || "Failed to post video" });
  }
};
exports.postImageFromURLOnTwitter = async (req, res) => {
  const { message, imageUrl } = req.body;
  try {
    if (
      !message ||
      typeof message !== "string" ||
      !imageUrl ||
      typeof imageUrl !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid message or image URL format" });
    }
    const postId = await twitterService.postImageToTwitter(message, imageUrl);
    res.json({ success: true, postId });
  } catch (error) {
    console.error("Error posting image from URL on Twitter:", error);
    res.status(500).json({ error: "Failed to post image from URL on Twitter" });
  }
};
