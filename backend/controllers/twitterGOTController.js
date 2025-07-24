// const path = require("path");
// const mongoose = require("mongoose");
// const got = require("got").default;
// const crypto = require("crypto");
// const OAuth = require("oauth-1.0a");
// const qs = require("querystring");

// const { TwitterApi } = require("twitter-api-v2");
// const workspaceAccountsService = require("../services/workspaceAccountsService");
// const socialMediaAccountService = require("../services/socialMediaAccountsService");
// const workspaceTwitterAccount = require("../services/workspaceTwitterAccountsService");
const userDetails = require("../models/userDetails");
const twitterService = require("../services/twitterService");
// const { profile } = require("console");

// exports.LoginToTwitter = async (req, res) => {
//   try {
//     //const {agencyId, platform, userId} = req.body;

//     const socialMediaAccount =
//       await socialMediaAccountService.getAgencyAccountByPlatform(
//         new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"),
//         "Twitter"
//       );

//     const oauth = OAuth({
//       consumer: {
//         key: process.env.TWITTER_CONSUMER_KEY,
//         secret: process.env.TWITTER_CONSUMER_SECRET,
//       },
//       signature_method: "HMAC-SHA1",
//       hash_function: (baseString, key) =>
//         crypto.createHmac("sha1", key).update(baseString).digest("base64"),
//     });

//     const requestTokenURL = "https://api.twitter.com/oauth/request_token";
//     const callbackUrl = process.env.TWITTER_CALLBACK_URL;

//     const tokenParams = {
//       oauth_callback: callbackUrl,
//       x_auth_access_type: "write",
//     };

//     // 1. Sign *both* parameters
//     const authHeader = oauth.toHeader(
//       oauth.authorize({
//         url: requestTokenURL,
//         method: "POST",
//         data: tokenParams,
//       })
//     );

//     // 2. Send the exact same parameters in the body
//     const reqToken = await got(requestTokenURL, {
//       method: "POST",
//       headers: {
//         Authorization: authHeader["Authorization"],
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       form: tokenParams, // <‑‑ note: form, not searchParams
//     });
//     if (!reqToken.body) {
//       throw new Error("Cannot get an OAuth request token");
//     }
//     console.log(reqToken.body);

//     const params = reqToken.body;

//     // Send the URL your frontend must redirect the user to
//     return res.json({
//       authorizeUrl: `https://api.twitter.com/oauth/authorize?${params}`,
//     });
//   } catch (error) {
//     console.error("Request token error:", error);
//     if (error.response?.body) {
//       console.error("Twitter says:", error.response.body); // <‑‑ add this
//     }
//     res.status(500).json({ error: "Failed to get request token" });
//   }
// };

// exports.TwitterCallback = async (req, res) => {
//   try {
//     // 1. Twitter sends ?oauth_token=XX&oauth_verifier=YY
//     const { oauth_token, oauth_verifier } = req.query;
//     if (!oauth_token || !oauth_verifier) {
//       return res
//         .status(400)
//         .json({ error: "Missing oauth_token or oauth_verifier" });
//     }

//     // 2. Get consumer keys the same way you did before
//     const socialMediaAccount =
//       await socialMediaAccountService.getAgencyAccountByPlatform(
//         new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"),
//         "Twitter"
//       );

//     const oauth = OAuth({
//       consumer: {
//         key: process.env.TWITTER_CONSUMER_KEY,
//         secret: process.env.TWITTER_CONSUMER_SECRET,
//       },
//       signature_method: "HMAC-SHA1",
//       hash_function: (b, k) =>
//         crypto.createHmac("sha1", k).update(b).digest("base64"),
//     });

//     // 3. Exchange request token + verifier for an access token
//     const accessTokenURL = "https://api.twitter.com/oauth/access_token";

//     const authHeader = oauth.toHeader(
//       oauth.authorize({
//         url: accessTokenURL,
//         method: "POST",
//         data: { oauth_token, oauth_verifier },
//       })
//     );

//     const accessResp = await got(accessTokenURL, {
//       method: "POST",
//       headers: {
//         Authorization: authHeader["Authorization"],
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       form: { oauth_token, oauth_verifier },
//     });

//     //const accessData = qs.parse(accessResp.body);
//     /*
//         accessData = {
//           oauth_token: 'USER_ACCESS_TOKEN',
//           oauth_token_secret: 'USER_ACCESS_SECRET',
//           user_id: '...',
//           screen_name: '...'
//         }
//       */

//     // 4. TODO: store accessData.oauth_token & accessData.oauth_token_secret for this workspace/user
//     // await workspaceTwitterAccount.saveCredentials(userId, accessData);

//     return res.json({
//       message: "Twitter account connected!",
//       data: accessResp.body,
//     });
//   } catch (err) {
//     console.error("Twitter callback error:", err);
//     return res.status(500).json({ error: "Access‑token exchange failed" });
//   }
// };

// exports.Post = async (req, res) => {
//   try {
//     // 1. Twitter sends ?oauth_token=XX&oauth_verifier=YY
//     const { oauth_token, oauth_token_secret, user_id, screen_name } = req.query;
//     const data = req.body;
//     if (!oauth_token || !oauth_token_secret) {
//       return res
//         .status(400)
//         .json({ error: "Missing oauth_token or oauth_token_secret" });
//     }
//     console.log("Data returned");

//     // 2. Get consumer keys the same way you did before
//     const socialMediaAccount =
//       await socialMediaAccountService.getAgencyAccountByPlatform(
//         new mongoose.Types.ObjectId("6853927f32ba76343aca7c4a"),
//         "Twitter"
//       );

//     const token = {
//       key: oauth_token,
//       secret: oauth_token_secret,
//     };
//     const endpointURL = `https://api.twitter.com/2/tweets`;
//     console.log("token");

//     const oauth = OAuth({
//       consumer: {
//         key: process.env.TWITTER_CONSUMER_KEY,
//         secret: process.env.TWITTER_CONSUMER_SECRET,
//       },
//       signature_method: "HMAC-SHA1",
//       hash_function: (b, k) =>
//         crypto.createHmac("sha1", k).update(b).digest("base64"),
//     });

//     console.log("oauth returned");
//     const authHeader = oauth.toHeader(
//       oauth.authorize(
//         {
//           url: endpointURL,
//           method: "POST",
//         },
//         token
//       )
//     );
//         console.log("auth header returned");
//     const reqPost = await got(endpointURL, {
//       method: "POST",
//       json: data,
//       responseType: "json",
//       headers: {
//         Authorization: authHeader["Authorization"],
//         "user-agent": "v2CreateTweetJS",
//         "content-type": "application/json",
//         accept: "application/json",
//       },
//     });
//     console.log("Data is posted");
//     if (reqPost.body) {
//         console.log("Returning response");
//       return res.json({
//         message: "Twitter account connected!",
//         data: reqPost.body,
//       });
//     } else {
//         console.log("Error in returning response");
//       throw new Error("Unsuccessful request");
//     }

//     //const accessData = qs.parse(accessResp.body);
//     /*
//           accessData = {
//             oauth_token: 'USER_ACCESS_TOKEN',
//             oauth_token_secret: 'USER_ACCESS_SECRET',
//             user_id: '...',
//             screen_name: '...'
//           }
//         */

//     // 4. TODO: store accessData.oauth_token & accessData.oauth_token_secret for this workspace/user
//     // await workspaceTwitterAccount.saveCredentials(userId, accessData);
//   } catch (err) {
//     console.error("Twitter callback error:", err);
//     return res.status(500).json({ error: "Access‑token exchange failed" });
//   }
// };

// exports.postWithMedia = async (req, res) => {
//     try {
//       const { oauth_token, oauth_token_secret } = req.query;
//       const { text = '' } = req.body;
//       const files = req.files || [];

//       if (!oauth_token || !oauth_token_secret) {
//         return res.status(400).json({ error: 'Missing oauth_token or oauth_token_secret' });
//       }
//       if (!files.length && !text) {
//         return res.status(400).json({ error: 'Provide text or media.' });
//       }

//       // Build a user‑authenticated client
//       const userClient = new TwitterApi({
//         appKey: process.env.TWITTER_CONSUMER_KEY,
//         appSecret: process.env.TWITTER_CONSUMER_SECRET,
//         accessToken: oauth_token,
//         accessSecret: oauth_token_secret,
//       });

//       // 1. Upload each file, get media_ids
//       let mediaIds = [];
//       if (files.length) {
//         mediaIds = await Promise.all(
//           files.map(f =>
//             userClient.v1.uploadMedia(f.path, {
//               type: f.mimetype.startsWith('video') ? 'video' : undefined, // auto‑switch to chunked
//             })
//           )
//         );
//       }

//       // 2. Create the tweet
//       const tweet = await userClient.v2.tweet({
//         text,
//         ...(mediaIds.length && { media: { media_ids: mediaIds } }),
//       });

//       return res.json({ ok: true, tweet });
//     } catch (err) {
//       console.error('postWithMedia error:', err);
//       res.status(500).json({ error: 'Tweet failed', detail: err.message });
//     }
//   };

exports.LoginToTwitter = async (req, res) => {
  try {
    const authorizeUrl = await twitterService.loginToTwitter();
    
    return res.json({ authorizeUrl });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Failed to get request token" });
  }
};

exports.TwitterCallback = async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    if (!oauth_token || !oauth_verifier) {
      return res
        .status(400)
        .json({ error: "Missing oauth_token or oauth_verifier" });
    }

    const result = await twitterService.twitterCallback(
      oauth_token,
      oauth_verifier
    );

    const parsed = result.parsed;
    return res.json({
      message: "Twitter account connected!",
      oauth: {
        oauth_token: parsed.oauth_token,
        oauth_token_secret: parsed.oauth_token_secret,
        user_id: parsed.user_id,
        screen_name: parsed.screen_name,
      },
      userDetails: JSON.parse(result.userDetails),
    });
    
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({ error: "Access-token exchange failed" });
  }
};

exports.postWithMedia = async (req, res) => {
  try {
    const { oauth_token, oauth_token_secret, userId, workspaceId } = req.query;
    const { text = "", labels = "", notes = "", boostBudget = 0 } = req.body;
    const files = req.files || [];

    if (!oauth_token || !oauth_token_secret) {
      return res
        .status(400)
        .json({ error: "Missing oauth_token or oauth_token_secret" });
    }

    if (!files.length && !text) {
      return res.status(400).json({ error: "Provide text or media." });
    }

    console.log("MetaData =>", { userId, workspaceId, labels, notes, boostBudget });
    console.log("FILES RECEIVED:", req.files);
    const result = await twitterService.postWithMedia(
      oauth_token,
      oauth_token_secret,
      text,
      req.files,
      { userId, workspaceId, labels, notes, boostBudget }
    );

    return res.json({ ok: true, tweet: result.tweet, postId: result.savedPostId });
  } catch (error) {
    console.error("Post error:", error);
    res.status(500).json({ error: "Tweet failed", detail: error.message });
  }
};

// old postwithmedia method
// exports.postWithMedia = async (req, res) => {
//   try {
//     const { oauth_token, oauth_token_secret } = req.query;
//     const { text = "" } = req.body;
//     const files = req.files || [];

//     if (!oauth_token || !oauth_token_secret) {
//       return res
//         .status(400)
//         .json({ error: "Missing oauth_token or oauth_token_secret" });
//     }

//     if (!files.length && !text) {
//       return res.status(400).json({ error: "Provide text or media." });
//     }

//     const tweet = await twitterService.postWithMedia(
//       oauth_token,
//       oauth_token_secret,
//       text,
//       files
//     );

//     return res.json({ ok: true, tweet });
//   } catch (error) {
//     console.error("Post error:", error);
//     res.status(500).json({ error: "Tweet failed", detail: error.message });
//   }
// };
