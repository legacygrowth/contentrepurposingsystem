const mongoose = require("mongoose");
const path = require('path');
const got = require('got');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');


const { TwitterApi } = require("twitter-api-v2");
const workspaceAccountsService = require("../services/workspaceAccountsService");
const socialMediaAccountService = require("../services/socialMediaAccountsService");
const workspaceTwitterAccount = require("../services/workspaceTwitterAccountsService");
const { profile } = require("console");


let loggedInClient;

exports.LoginToTwitter = async (req, res) => {
  try {
    //const {agencyId, platform, userId} = req.body;

    const socialMediaAccount = await socialMediaAccountService.getAgencyAccountByPlatform(new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"), "Twitter");
    
    const loginClient = new TwitterApi({
      clientId: socialMediaAccount.clientId,
      clientSecret: socialMediaAccount.clientSecret,
    });

    const loginUser = loginClient.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL,
      { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );

    const accountData = {
      userId: new mongoose.Types.ObjectId("6659a32227ffbd2c0a16380d"), // replace with actual user ID dynamically if needed
      platform: "twitter",
      accessToken: "",
      accessSecret: "",
      refreshToken: "",
      expiresIn: "",
      twitterHandle: "",
      authorUrn: "",
      oauthToken: "", // :small_blue_diamond: Include oauth_token
      oauthVerifier: loginUser.codeVerifier,
      agencyID: socialMediaAccount.agencyID,
      workSpaceID: socialMediaAccount.workSpaceID,
      code: "New",
      state: loginUser.state
    }
    const account = await workspaceAccountsService.createOrUpdateTwitterAccount(accountData);

    res.json({ loginUser, account });
  } catch (error) {
    console.error("Request token error:", error);
    res.status(500).json({ error: "Failed to get request token" });
  }
};

exports.CallBackFromTwitter = async (req, res) => {
  const { state, code } = req.query;

  const socialMediaAccount = await socialMediaAccountService.getAgencyAccountByPlatform(new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"), "Twitter");
    
  try {
    const workspaceAccount = await workspaceAccountsService.getAgencyNewAccount(socialMediaAccount.agencyID, "twitter", socialMediaAccount.workSpaceID, new mongoose.Types.ObjectId("6659a32227ffbd2c0a16380d"));
    
    if(workspaceAccount){

      const twitterClient = new TwitterApi({
        clientId: socialMediaAccount.clientId,
        clientSecret: socialMediaAccount.clientSecret,
      });

      const  loggedInClient = await twitterClient.loginWithOAuth2({
            code,
            codeVerifier: workspaceAccount.oauthVerifier,
            redirectUri: process.env.TWITTER_CALLBACK_URL,
          });


          if(loggedInClient){
            console.log("Saving information");
            var twitterAccount = await workspaceTwitterAccount.insertWorkspaceTwitterAccount(workspaceAccount.workSpaceID, {
              twitterUserId: "",
              twitterUserName: "",
              accessToken: loggedInClient.accessToken,
              refreshToken: loggedInClient.refreshToken,
              expiresIn: new Date(Date.now() + loggedInClient.expiresIn * 1000).toISOString(),
              profile: loggedInClient,
            })
          }
       
      const accountData = {
        userId: workspaceAccount.userId, // replace with actual user ID dynamically if needed
        platform: workspaceAccount.platform,
        accessToken: workspaceAccount.accessToken,
        accessSecret: workspaceAccount.accessSecret,
        refreshToken: workspaceAccount.refreshToken,
        expiresIn: workspaceAccount.expiresIn,
        twitterHandle: workspaceAccount.twitterHandle,
        authorUrn: workspaceAccount.authorUrn,
        oauthToken: workspaceAccount.oauthToken, // :small_blue_diamond: Include oauth_token
        oauthVerifier: workspaceAccount.oauthVerifier,
        agencyID: workspaceAccount.agencyID,
        workSpaceID: workspaceAccount.workSpaceID,
        code: code,
        state: workspaceAccount.state
      }
      const account = await workspaceAccountsService.createOrUpdateTwitterAccount(accountData);      
      res.json({ loggedInClient, account });
    }
    
  } catch (e) {
    console.error(e);
    res.json({Message: 'OAuth failed', error: e});
  }
};

const getMediaType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (videoExtensions.includes(extension)) return "video";
  if (imageExtensions.includes(extension)) return "image";
  return "unknown";
};


exports.PostToTwiiter = async (req, res) => {
  
  try {
    const {
    planning,
    postDate,
    platform,
    platformId,
    caption,
    labels,
    notes,
    boostBudget,
    workspaceId,
    media,
    approvalStatus,
  } = req.body;
    const tweetText = caption;
    const filePaths = req.files? req.files.map((file) => file.path): [];
    
    const filePath = filePaths[0];;    
    const mediaType = getMediaType(filePath);

    let mediaId;


    const twitterCreds = await workspaceTwitterAccount.getTwitterAccountById(new mongoose.Types.ObjectId("685d1c7fb3c7254a9fe85436"));
    const workspaceSocialAccount = await workspaceAccountsService.getWorkspaceAccountById(new mongoose.Types.ObjectId("685c7d8e3459a64a3ae74278"));
    
    if(twitterCreds){

      const socialMediaAccount = await socialMediaAccountService.getAgencyAccountByPlatform(new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"), "Twitter");

      const twitterClient = new TwitterApi({
        clientId: socialMediaAccount.clientId,
        clientSecret: socialMediaAccount.clientSecret,
      });

      let userClient;

     
        if (new Date(twitterCreds.expiresIn) < new Date()) {
          const {
            client: refreshedClient,
            accessToken,
            refreshToken,
            expiresIn
          } = await twitterClient.refreshOAuth2Token(twitterCreds.refreshToken);

          twitterCreds.accessToken = accessToken;
          twitterCreds.refreshToken = refreshToken;
          twitterCreds.expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
          twitterCreds.profile.client = refreshedClient;
          twitterCreds.profile.accessToken = accessToken;
          twitterCreds.profile.refreshToken = refreshToken;
              
          const updatedToken = await workspaceTwitterAccount.updateTwitterAccount(twitterCreds._id, twitterCreds);

          userClient = refreshedClient;
          //userClient = updatedToken;
        } else {
          // ✅ Token still valid — use it directly
          userClient = new TwitterApi(twitterCreds.accessToken);
          //userClient = twitterCreds.profile;
        }

        console.log(userClient);

        // Upload media (auto-handles video chunking if needed)
      const mediaData = await userClient.v1.uploadMedia(filePath, {
        mimeType: mediaType,
      });

      console.log("Media data", mediaData);


      mediaId = mediaData;
      fs.unlinkSync(filePaths); // Clean up uploaded file

      // Post tweet with media
      const tweet = await userClient.v2.tweet({
        text: tweetText,
        media: {
          media_ids: [mediaId],
        },
      });

       res.json(`Tweet posted! ID: ${tweet.data.id}`);
    }

  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to post tweet with media');
  }

};

