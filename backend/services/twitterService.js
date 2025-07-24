const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const got = require("got").default;
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const mongoose = require("mongoose");
const qs = require("querystring");
const workspaceTwitterAccounts = require("../models/workspaceTwitterAccounts");
const sysUser = require("../models/sysUserModel");
const postService = require("./postService");
const postMediaService = require("./postMediaService");
// ------------------------------
// Helpers
// ------------------------------
// const handleTwitterRateLimit = (error) => {
//   if (error?.code === 429) {
//     const resetTime = error?.rateLimit?.day?.reset;
//     const resetDate = resetTime
//       ? new Date(resetTime * 1000)
//       : new Date(Date.now() + 86400000);
//     return `Twitter rate limit exceeded. Rate limit resets at ${resetDate.toLocaleString()}.`;
//   }
//   return error.message || "Unknown Twitter error";
// };

// function validateMediaFile(filePath) {
//   if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
//   const stats = fs.statSync(filePath);
//   const maxSize = 512 * 1024 * 1024; // 512MB
//   if (stats.size > maxSize) throw new Error("File exceeds allowed size limit");
//   return stats.size;
// }

// function getMediaTypeInfo(filePath) {
//   const ext = path.extname(filePath).toLowerCase();
//   switch (ext) {
//     case ".mp4":
//     case ".mov":
//       return { mimeType: "video/mp4", mediaCategory: "tweet_video" };
//     case ".png":
//       return { mimeType: "image/png", mediaCategory: "tweet_image" };
//     case ".gif":
//       return { mimeType: "image/gif", mediaCategory: "tweet_gif" };
//     case ".jpg":
//     case ".jpeg":
//     default:
//       return { mimeType: "image/jpeg", mediaCategory: "tweet_image" };
//   }
// }

// function createTwitterClient(credentials = {}) {
//   const appKey = credentials.appKey || process.env.TWITTER_CONSUMER_KEY;
//   const appSecret =
//     credentials.appSecret || process.env.TWITTER_CONSUMER_SECRET;
//   const accessToken = credentials.accessToken;
//   const accessSecret = credentials.accessSecret || credentials.access_secret;
//   if (!appKey || !appSecret || !accessToken || !accessSecret) {
//     console.error(":x: Missing Twitter credentials", {
//       appKeyExists: !!appKey,
//       appSecretExists: !!appSecret,
//       accessTokenExists: !!accessToken,
//       accessSecretExists: !!accessSecret,
//     });
//     throw new Error(":x: Missing Twitter credentials (OAuth 1.0a required)");
//   }
//   return new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
// }

// ------------------------------
// Posting Functions
// ------------------------------

// exports.loginToTwitter = async () => {
//   const socialMediaAccount = await socialMediaAccountService.getAgencyAccountByPlatform(
//     new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"),
//     "Twitter"
//   );

//   const oauth = OAuth({
//     consumer: {
//       key: process.env.TWITTER_CONSUMER_KEY,
//       secret: process.env.TWITTER_CONSUMER_SECRET,
//     },
//     signature_method: "HMAC-SHA1",
//     hash_function: (baseString, key) =>
//       crypto.createHmac("sha1", key).update(baseString).digest("base64"),
//   });

//   const requestTokenURL = "https://api.twitter.com/oauth/request_token";
//   const callbackUrl = process.env.TWITTER_CALLBACK_URL;

//   const tokenParams = {
//     oauth_callback: callbackUrl,
//     x_auth_access_type: "write",
//   };

//   const authHeader = oauth.toHeader(
//     oauth.authorize({
//       url: requestTokenURL,
//       method: "POST",
//       data: tokenParams,
//     })
//   );

//   const reqToken = await got(requestTokenURL, {
//     method: "POST",
//     headers: {
//       Authorization: authHeader["Authorization"],
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     form: tokenParams,
//   });

//   if (!reqToken.body) {
//     throw new Error("Cannot get an OAuth request token");
//   }
//   console.log(reqToken.body);

//   const params = reqToken.body;
//   return `https://api.twitter.com/oauth/authorize?${params}`;
// };

function createOAuthClient() {
  return OAuth({
    consumer: {
      key: process.env.TWITTER_CONSUMER_KEY,
      secret: process.env.TWITTER_CONSUMER_SECRET,
    },
    signature_method: "HMAC-SHA1",
    hash_function: (baseString, key) =>
      crypto.createHmac("sha1", key).update(baseString).digest("base64"),
  });
}

async function getTwitterAgencyAccount() {
  return await socialMediaAccountService.getAgencyAccountByPlatform(
    "6853927f32ba76343aca7c4a",
    "Twitter"
  );
}

async function loginToTwitter() {
  // const getTwitterAgencyAccount = getTwitterAgencyAccount();
  const oauth = createOAuthClient();
  const requestTokenURL = process.env.TWITTER_API_URL + "/oauth/request_token";
  console.log("oauthtoken received");

  const callbackUrl = process.env.TWITTER_CALLBACK_URL;

  const tokenParams = {
    oauth_callback: callbackUrl,
    x_auth_access_type: "write",
  };

  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: "POST",
      data: tokenParams,
    })
  );
  console.log("oauthheader received");
  const reqToken = await got(requestTokenURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"],
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: tokenParams,
  });
  console.log("req token received");
  return `${process.env.TWITTER_API_URL}/oauth/authorize?${reqToken.body}`;
}

async function twitterCallback(oauth_token, oauth_verifier) {
  const oauth = createOAuthClient();
  const accessTokenURL = `${process.env.TWITTER_API_URL}/oauth/access_token`;

  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: "POST",
      data: { oauth_token, oauth_verifier },
    })
  );

  const accessResp = await got(accessTokenURL, {
    method: "POST",
    headers: {
      Authorization: authHeader["Authorization"],
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: { oauth_token, oauth_verifier },
  });

  const parsed = qs.parse(accessResp.body)
  const userDetailsRaw = await getAuthenticatedUserInfo(parsed.oauth_token,parsed.oauth_token_secret);
  const userDetails = JSON.parse(userDetailsRaw);

  // 🆕 Insert into workspaceTwitterAccounts
  const newTwitterAccount = new workspaceTwitterAccounts({
    workspaceId: "6853927f32ba76343aca7c4c",
    twitterUserId: parsed.user_id,
    twitterUserName: parsed.screen_name,
    accessToken: parsed.oauth_token,
    refreshToken: parsed.oauth_token_secret,
    expiresIn: null,
    profile: userDetails?.data || {},
  });

  await newTwitterAccount.save();

const fullName = userDetails?.data?.name || "";
const firstName = fullName.split(" ")[0] || "";
const lastName = fullName.split(" ").slice(1).join(" ") || "";

const newSysUser = new sysUser({
  twitterId: userDetails?.data?.id,
  twitterUserName: parsed?.screen_name,
  accessToken: parsed?.oauth_token,
  refreshToken: parsed?.oauth_token_secret,
  profilePicture: userDetails?.data?.profile_image_url,
  firstName: firstName,
  lastName: lastName,
  description: userDetails?.data?.description,
  twitterJoinedAt: userDetails?.data?.created_at,
  isActive: true,
  isBlocked: false,
  isPaymentVerified: false,
  failedLoginAttempts: 0,
});
await newSysUser.save();

  return {
    parsed,
    userDetails:userDetailsRaw,
  }
}

async function postWithMedia(oauth_token, oauth_token_secret, text, files, metaData) {
  const userClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  let mediaIds = [];
  if (files.length) {
    mediaIds = await Promise.all(
      files.map((f) =>
        userClient.v1.uploadMedia(f.path, {
          type: f.mimetype.startsWith("video") ? "video" : undefined,
        })
      )
    );
  }

  const tweet = await userClient.v2.tweet({
    text,
    ...(mediaIds.length && { media: { media_ids: mediaIds } }),
  });

  const savedPost = await postService.createPostWithTweetInfo(tweet, {
    text,
    userId: metaData.userId,
    workspaceId: metaData.workspaceId,
    labels: metaData.labels || "",
    notes: metaData.notes || "",
    boostBudget: metaData.boostBudget || 0,
    filenames: files.map(f => f.filename),
  });

  await postMediaService.createPostMediaForFiles(savedPost._id, files, {
    twitterTweetId: tweet?.data?.id || "",
  });

  return { tweet,
  savedPostId: savedPost._id,
  };
}

// old postwithmedia Method
// async function postWithMedia(oauth_token, oauth_token_secret, text, files) {
//   const userClient = new TwitterApi({
//     appKey: process.env.TWITTER_CONSUMER_KEY,
//     appSecret: process.env.TWITTER_CONSUMER_SECRET,
//     accessToken: oauth_token,
//     accessSecret: oauth_token_secret,
//   });

//   let mediaIds = [];
//   if (files.length) {
//     mediaIds = await Promise.all(
//       files.map((f) =>
//         userClient.v1.uploadMedia(f.path, {
//           type: f.mimetype.startsWith("video") ? "video" : undefined,
//         })
//       )
//     );
//   }

//   const tweet = await userClient.v2.tweet({
//     text,
//     ...(mediaIds.length && { media: { media_ids: mediaIds } }),
//   });

//   return tweet;
// }

// This Method is for Getting Twitter User Details which just Authorized for Posting.

async function getAuthenticatedUserInfo(oauth_token, oauth_token_secret) {

  const oauth = createOAuthClient();

  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const endpointURL = "https://api.twitter.com/2/users/me";
  const queryParams =
    "user.fields=created_at,description,profile_image_url,username";

  const url = `${endpointURL}?${queryParams}`;
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: `${endpointURL}?${queryParams}`,
        method: "GET",
      },
      token
    )
  );

  const response = await got.get(url, {
    method: "GET",
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2-user-lookup",
    },
  });

  return response.body;
}

// ------------------------------
// Exports
// ------------------------------
module.exports = {
  loginToTwitter,
  twitterCallback,
  postWithMedia,
  createOAuthClient,
  getTwitterAgencyAccount,
  getAuthenticatedUserInfo,
};

// Old Twitter Service

// const { TwitterApi } = require("twitter-api-v2");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();
// const handleTwitterRateLimit = (error) => {
//   if (error?.code === 429) {
//     const resetTime = error?.rateLimit?.day?.reset;
//     const resetDate = resetTime
//       ? new Date(resetTime * 1000)
//       : new Date(Date.now() + 86400000);
//     const formattedTime = resetDate.toLocaleString();
//     return `Twitter rate limit exceeded. Twitter limits to 17 posts per day. Rate limit resets at ${formattedTime}.`;
//   }
//   return error.message;
// };
// // Replace with your actual credentials
// const client = new TwitterApi({
//   appKey: process.env.TWITTER_APP_KEY,
//   appSecret: process.env.TWITTER_APP_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_SECRET,
// });
// // Helper for file validation
// function validateMediaFile(filePath) {
//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File not found: ${filePath}`);
//   }
//   const stats = fs.statSync(filePath);
//   // Twitter specific limits - videos can be up to 512MB for some account types
//   const maxSize = 512 * 1024 * 1024; // 512MB
//   if (stats.size > maxSize) {
//     throw new Error("File exceeds allowed size limit");
//   }
//   return stats.size;
// }
// // Helper function to get MIME type and category
// function getMediaTypeInfo(filePath) {
//   const fileExtension = path.extname(filePath).toLowerCase();
//   switch (fileExtension) {
//     case ".mp4":
//       return {
//         mimeType: "video/mp4",
//         mediaCategory: "tweet_video",
//       };
//     case ".mov":
//       return {
//         mimeType: "video/mp4", // Twitter treats MOV as MP4
//         mediaCategory: "tweet_video",
//       };
//     case ".png":
//       return {
//         mimeType: "image/png",
//         mediaCategory: "tweet_image",
//       };
//     case ".gif":
//       return {
//         mimeType: "image/gif",
//         mediaCategory: "tweet_gif",
//       };
//     case ".jpg":
//     case ".jpeg":
//       return {
//         mimeType: "image/jpeg",
//         mediaCategory: "tweet_image",
//       };
//     default:
//       return {
//         mimeType: "image/jpeg",
//         mediaCategory: "tweet_image",
//       };
//   }
// }
// // Universal media posting function - fallback to v1 upload
// const postTextWithMediaToTwitter = async function (
//   message,
//   mediaFilePath,
//   appKey,
//   appSecret,
//   accessToken,
//   accessSecret
// ) {
//   if (!message || !mediaFilePath) {
//     throw new Error("Message and media file path are required");
//   }
//   try {
//     const twitterClient = new TwitterApi({
//       appKey: appKey || process.env.TWITTER_APP_KEY,
//       appSecret: appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret: accessSecret || process.env.TWITTER_ACCESS_SECRET,
//     });
//     validateMediaFile(mediaFilePath);
//     const { mimeType } = getMediaTypeInfo(mediaFilePath);
//     // Use v1 API for media upload (still works until March 2025)
//     const mediaId = await twitterClient.v1.uploadMedia(mediaFilePath, {
//       mimeType: mimeType,
//     });
//     // Use v2 API for tweeting
//     const tweet = await twitterClient.v2.tweet({
//       text: message,
//       media: { media_ids: [mediaId] },
//     });
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Media Tweet Error:", error);
//     const errorMessage =
//       handleTwitterRateLimit(error) || "Failed to post tweet";
//     throw new Error("Failed to post media tweet: " + error.message);
//   }
// };
// // Modified text-only tweet function
// const postTextToTwitter = async function (message, credentials = {}) {
//   try {
//     const twitterClient = new TwitterApi({
//       appKey: credentials.appId || process.env.TWITTER_APP_KEY,
//       appSecret: credentials.appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: credentials.accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret:
//         credentials.userAccessToken || process.env.TWITTER_ACCESS_SECRET,
//     });
//     const tweet = await twitterClient.v2.tweet(message);
//     console.log("Tweet posted successfully:", tweet.data.id);
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Text Tweet Error:", error?.data || error.message);
//     const errorMessage =
//       handleTwitterRateLimit(error) || "Failed to post tweet";
//     throw new Error(errorMessage);
//   }
// };
// // Modified image posting function
// const postImageToTwitter = async (text, imagePath, credentials = {}) => {
//   try {
//     validateMediaFile(imagePath);
//     const { mimeType } = getMediaTypeInfo(imagePath);
//     const twitterClient = new TwitterApi({
//       appKey: credentials.appId || process.env.TWITTER_APP_KEY,
//       appSecret: credentials.appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: credentials.accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret:
//         credentials.userAccessToken || process.env.TWITTER_ACCESS_SECRET,
//     });
//     // Use v1 API for media upload (still works)
//     const mediaId = await twitterClient.v1.uploadMedia(imagePath, {
//       mimeType: mimeType,
//     });
//     // Use v2 API for tweeting
//     const tweet = await twitterClient.v2.tweet({
//       text,
//       media: { media_ids: [mediaId] },
//     });
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Image Tweet Error:", error);
//     const errorMessage =
//       handleTwitterRateLimit(error) || "Failed to post tweet";
//     throw new Error(errorMessage);
//   }
// };
// // Modified video posting function
// const postVideoToTwitter = async (text, videoPath, credentials = {}) => {
//   try {
//     validateMediaFile(videoPath);
//     const { mimeType } = getMediaTypeInfo(videoPath);
//     const twitterClient = new TwitterApi({
//       appKey: credentials.appId || process.env.TWITTER_APP_KEY,
//       appSecret: credentials.appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: credentials.accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret:
//         credentials.userAccessToken || process.env.TWITTER_ACCESS_SECRET,
//     });
//     // Use v1 API for media upload
//     const mediaId = await twitterClient.v1.uploadMedia(videoPath, {
//       mimeType: mimeType,
//     });
//     // Use v2 API for tweeting
//     const tweet = await twitterClient.v2.tweet({
//       text,
//       media: { media_ids: [mediaId] },
//     });
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Video Tweet Error:", error);
//     const errorMessage =
//       handleTwitterRateLimit(error) || "Failed to post tweet";
//     throw new Error(errorMessage);
//   }
// };
// // Modified caption-only tweet
// const postCaptionOnlyTweet = async (text, credentials = {}) => {
//   try {
//     const twitterClient = new TwitterApi({
//       appKey: credentials.appId || process.env.TWITTER_APP_KEY,
//       appSecret: credentials.appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: credentials.accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret:
//         credentials.userAccessToken || process.env.TWITTER_ACCESS_SECRET,
//     });
//     const tweet = await twitterClient.v2.tweet(text);
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Caption-only Tweet Error:", error);
//     const errorMessage =
//       handleTwitterRateLimit(error) || "Failed to post tweet";
//     throw new Error(errorMessage);
//   }
// };
// // Modified multiple images function
// const postMultipleImagesToTwitter = async (
//   text,
//   imagePaths,
//   credentials = {}
// ) => {
//   try {
//     // Twitter allows maximum 4 images per tweet
//     const validImagePaths = imagePaths.slice(0, 4);
//     const twitterClient = new TwitterApi({
//       appKey: credentials.appId || process.env.TWITTER_APP_KEY,
//       appSecret: credentials.appSecret || process.env.TWITTER_APP_SECRET,
//       accessToken: credentials.accessToken || process.env.TWITTER_ACCESS_TOKEN,
//       accessSecret:
//         credentials.userAccessToken || process.env.TWITTER_ACCESS_SECRET,
//     });
//     // Upload each image and collect media IDs
//     const mediaIds = [];
//     for (const imagePath of validImagePaths) {
//       validateMediaFile(imagePath);
//       const { mimeType } = getMediaTypeInfo(imagePath);
//       // Use v1 API for media upload
//       const mediaId = await twitterClient.v1.uploadMedia(imagePath, {
//         mimeType: mimeType,
//       });
//       mediaIds.push(mediaId);
//     }
//     // Use v2 API for tweeting with multiple media
//     const tweet = await twitterClient.v2.tweet({
//       text,
//       media: { media_ids: mediaIds },
//     });
//     return tweet.data.id;
//   } catch (error) {
//     console.error("Multiple Images Tweet Error:", error);
//     const errorMessage =
//       handleTwitterRateLimit(error) ||
//       "Failed to post tweet with multiple images";
//     throw new Error(errorMessage);
//   }
// };
// module.exports = {
//   postTextWithMediaToTwitter,
//   postTextToTwitter,
//   postImageToTwitter,
//   postVideoToTwitter,
//   postCaptionOnlyTweet,
//   postMultipleImagesToTwitter,
// };
