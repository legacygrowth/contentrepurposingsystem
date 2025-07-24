const { TwitterApi } = require("twitter-api-v2");
const workspaceAccountsService = require("../services/workspaceAccountsService");
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
});
// Step 1: Get Twitter OAuth link
exports.getTwitterAuthLink = async (req, res) => {
  try {
    const { url, oauth_token, oauth_token_secret } =
      await client.generateAuthLink(process.env.TWITTER_CALLBACK_URL);
    // Store token in session for later use
    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;
    res.json({ url });
  } catch (error) {
    console.error("Request token error:", error);
    res.status(500).json({ error: "Failed to get request token" });
  }
};
// Step 2: Twitter redirects back to this callback
exports.handleTwitterCallback = async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  if (
    !oauth_token ||
    !oauth_verifier ||
    oauth_token !== req.session.oauth_token
  ) {
    return res.status(403).json({ error: "Invalid OAuth token or verifier" });
  }
  try {
    // const loginClient = new TwitterApi({
    //   appKey: process.env.TWITTER_CONSUMER_KEY,
    //   appSecret: process.env.TWITTER_CONSUMER_SECRET,
    //   accessToken: req.session.oauth_token,
    //   accessSecret: req.session.oauth_token_secret,
    // });
    // // :closed_lock_with_key: Finalize login and get tokens
    // const {
    //   accessToken,
    //   accessSecret,
    //   userId,
    //   screenName,
    // } = await loginClient.login(oauth_verifier);
    // :white_check_mark: Save Twitter account to workspaceAccounts
    const result = await workspaceAccountsService.createOrUpdateTwitterAccount({
      userId: "6659a32227ffbd2c0a16380d", // replace with actual user ID dynamically if needed
      platform: "twitter",
      accessToken: req.session.oauth_token,
      accessSecret: req.session.oauth_token_secret,
      refreshToken: "",
      expiresIn: "",
      twitterHandle: "",
      authorUrn: "",
      oauthToken: oauth_token, // :small_blue_diamond: Include oauth_token
      oauthVerifier: oauth_verifier,
      agencyID: "6853927f32ba76343aca7c4a",
      workSpaceID: "6853927f32ba76343aca7c4c",
    });
    console.log("Saved the data");
    res.status(200).json({
      message: "Twitter account saved successfully",
      account: result,
    });
  } catch (error) {
    console.error("Twitter callback error:", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
};
