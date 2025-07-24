const mongoose = require("mongoose");
const postService = require("../services/postService");
const postMediaService = require("../services/postMediaService");
const twitterService = require("../services/twitterService");
const socialPostingService = require("../services/socialPostingService");
const workspaceAccounts = require("../models/workspaceAccounts");
const workspaceAccountsService = require("../services/workspaceAccountsService");
const socialMediaAccountsService = require("../services/socialMediaAccountsService");
const { TwitterApi } = require("twitter-api-v2");

// This createpost Method is for Twitter made by Akhtar Bhai
// exports.createPost = async (req, res) => {
//   const {
//     planning,
//     postDate,
//     platform,
//     platformId,
//     caption,
//     labels,
//     notes,
//     boostBudget,
//     workspaceId,
//     media,
//     approvalStatus,
//   } = req.body;
//   const files = req.files?.map((file) => file.filename);
//   const { oauth_verifier } = req.query;
//   try {
//     const postData = {
//       planning,
//       postDate,
//       platform,
//       platformId,
//       caption,
//       labels,
//       notes,
//       boostBudget,
//       workspaceId,
//       postMedia: files,
//       approvalStatus,
//     };
//     const newPost = await postService.createPost(postData);
//     if (planning.toLowerCase() === "now") {
//       const socialMediaIds = platformId.split(",");
//       for (const id of socialMediaIds) {
//         try {
//           const accountId = new mongoose.Types.ObjectId(id);
//           let workspaceAccount =
//             await workspaceAccountsService.getWorkspaceAccountById(accountId);
//           // If account exists and access is missing but oauth_verifier is present → login now
//           if (workspaceAccount) {
//             const agencyTwitterCreds =
//               await socialMediaAccountsService.getAgencyAccountByPlatform(
//                 "6853927f32ba76343aca7c4a",
//                 "twitter"
//               );
//             if (agencyTwitterCreds) {
//               const loginClient = new TwitterApi({
//                 appKey: process.env.TWITTER_CONSUMER_KEY,
//                 appSecret: process.env.TWITTER_CONSUMER_SECRET,
//                 accessToken: workspaceAccount.oauthToken,
//                 accessSecret: workspaceAccount.accessSecret,
//               });
//               console.log("logging client", loginClient);
//               const clientCredentials = await loginClient.login(
//                 workspaceAccount.oauthVerifier
//               );
//               // const clientCredentials = await loginClient.login({
//               //   oauth_token: workspaceAccount.oauthToken, // token from Twitter redirect
//               //   oauth_verifier: workspaceAccount.oauthVerifier, // verifier from query param
//               // });
//               // const { client, accessToken, accessSecret } = await loginClient.login({
//               //   workspaceAccount.oauthToken,        // from callback URL
//               //   workspaceAccount.oauthVerifier,  // from callback URL
//               // });
//               console.log("loging cred", clientCredentials);
//               const filePaths = req.files
//                 ? req.files.map((file) => file.path)
//                 : [];
//               const credentials = {
//                 appId: agencyTwitterCreds.appId,
//                 appSecret: agencyTwitterCreds.appSecret,
//                 accessToken: agencyTwitterCreds.accessToken,
//                 accessSecret: agencyTwitterCreds.accessSecret,
//                 userAccessToken: agencyTwitterCreds.userAccessToken,
//                 // accessToken: clientCredentials.accessToken, // :white_check_mark: use the user's tokens
//                 // accessSecret: clientCredentials.accessSecret, // :white_check_mark: use the user's tokens
//                 // userAccessToken: clientCredentials.accessToken,
//               };
//               const platformPostId =
//                 await socialPostingService.postToSocialMedia(
//                   workspaceAccount.platform,
//                   caption,
//                   filePaths,
//                   credentials,
//                   clientCredentials
//                 );
//               if (platformPostId) {
//                 console.log(
//                   `:white_check_mark: Successfully posted to ${workspaceAccount.platform}, ID:`,
//                   platformPostId
//                 );
//                 await postService.updatePost(newPost._id, {
//                   platformId: platformPostId,
//                 });
//               }
//             }
//           }
//           else if (workspaceAccount.platform === "facebook") {
//             const credentials = {
//               pageAccessToken: workspaceAccount.accessToken,
//               pageId: workspaceAccount.pageId,
//             };
//             const platformPostId = await socialPostingService.postToSocialMedia(
//               "facebook",
//               caption,
//               filePaths,
//               credentials
//             );

//             if (platformPostId) {
//               await postService.updatePost(newPost._id, {
//                 platformId: platformPostId,
//               });  
//             } 
//           }
//         }
//       } catch (error) {
//         console.error(":x: Error posting to social media:", error);
//         if (error.message.includes("rate limit")) {
//           await postService.updatePost(newPost._id, {
//             approvalStatus: "rate-limited",
//           });
//         }
//       }
//     }
//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error(":x: Error creating post:", error.message);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// };


// This createpost Method is for Twitter and Facebook( According to Newly Flow)
// exports.createPost = async (req, res) => {
//   const {
//     planning,
//     postDate,
//     platform,
//     platformId,
//     caption,
//     labels,
//     notes,
//     boostBudget,
//     workspaceId,
//     media,
//     approvalStatus,
//   } = req.body;

//   const files = req.files?.map((file) => file.filename);
//   const { oauth_verifier } = req.query;

//   try {
//     const postData = {
//       planning,
//       postDate,
//       platform,
//       platformId,
//       caption,
//       labels,
//       notes,
//       boostBudget,
//       workspaceId,
//       postMedia: files,
//       approvalStatus,
//     };

//     const newPost = await postService.createPost(postData);

//     if (planning.toLowerCase() === "now") {
//       const socialMediaIds = platformId.split(",");

//       for (const id of socialMediaIds) {
//         try {
//           const accountId = new mongoose.Types.ObjectId(id);
//           let workspaceAccount = await workspaceAccountsService.getWorkspaceAccountById(accountId);

//           if (workspaceAccount) {
//             const filePaths = req.files ? req.files.map((file) => file.path) : [];

//             //  FACEBOOK Posting
//             if (workspaceAccount.platform === "facebook") {
//               const issuedAt = new Date(workspaceAccount.tokenIssuedAt || workspaceAccount.createdAt); // fallback
//               const daysSinceIssued = Math.floor((Date.now() - issuedAt.getTime()) / (1000 * 60 * 60 * 24));

//               if (daysSinceIssued >= 50) {
//                 console.warn("⚠️ Facebook token is expiring soon.");
//                 await postService.updatePost(newPost._id, {
//                   approvalStatus: "token-expiring",
//                   notes: (newPost.notes || "") + "\n⚠️ Facebook token near expiry. Reconnect account.",
//                 });
//               }
//               const isValid = await facebookService.validatePageAccess(
//                 workspaceAccount.pageId,
//                 workspaceAccount.accessToken
//               );
            
//               if (!isValid) {
//                 console.warn("⚠️ Facebook token expired or invalid.");
//                 await postService.updatePost(newPost._id, {
//                   approvalStatus: "token-expired",
//                 });
//                 continue; // Skip to next platformId
//               }
//               const credentials = {
//                 pageAccessToken: workspaceAccount.accessToken,
//                 pageId: workspaceAccount.pageId,
//               };

//               const platformPostId = await socialPostingService.postToSocialMedia(
//                 "facebook",
//                 caption,
//                 filePaths,
//                 credentials
//               );

//               if (platformPostId) {
//                 await postService.updatePost(newPost._id, {
//                   platformId: platformPostId,
//                 });
//               }
//             }

//             //  TWITTER Posting
//             if (workspaceAccount.platform === "twitter") {
//               const agencyTwitterCreds =
//                 await socialMediaAccountsService.getAgencyAccountByPlatform(
//                   "6853927f32ba76343aca7c4a",
//                   "twitter"
//                 );

//               if (agencyTwitterCreds) {
//                 const loginClient = new TwitterApi({
//                   appKey: process.env.TWITTER_CONSUMER_KEY,
//                   appSecret: process.env.TWITTER_CONSUMER_SECRET,
//                   accessToken: workspaceAccount.oauthToken,
//                   accessSecret: workspaceAccount.accessSecret,
//                 });

//                 const clientCredentials = await loginClient.login(workspaceAccount.oauthVerifier);

//                 const credentials = {
//                   appId: agencyTwitterCreds.appId,
//                   appSecret: agencyTwitterCreds.appSecret,
//                   accessToken: agencyTwitterCreds.accessToken,
//                   accessSecret: agencyTwitterCreds.accessSecret,
//                   userAccessToken: agencyTwitterCreds.userAccessToken,
//                 };

//                 const platformPostId = await socialPostingService.postToSocialMedia(
//                   workspaceAccount.platform,
//                   caption,
//                   filePaths,
//                   credentials,
//                   clientCredentials
//                 );

//                 if (platformPostId) {
//                   await postService.updatePost(newPost._id, {
//                     platformId: platformPostId,
//                   });
//                 }
//               }
//             }
//           }
//         } catch (error) {
//           console.error(":x: Error posting to social media:", error);
//           if (error.message.includes("rate limit")) {
//             await postService.updatePost(newPost._id, {
//               approvalStatus: "rate-limited",
//             });
//           }
//         }
//       }
//     }

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error(":x: Error creating post:", error.message);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// }; 

exports.getPosts = async (req, res) => {
  try {
    const posts = await postService.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);
    res.status(500).json({ message: "Failed to fetch post by ID" });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const postData = req.body;
  try {
    const updatedPost = await postService.updatePost(id, postData);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ message: "Failed to update post" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await postService.deletePost(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Old Post Controller

// const mongoose = require("mongoose");
// const postService = require("../services/postService");
// const postMediaService = require("../services/postMediaService");
// const twitterService = require("../services/twitterService");
// const socialMediaAccountsService = require("../services/socialMediaAccountsService");
// const socialPostingService = require("../services/socialPostingService");

exports.createPost = async (req, res) => {
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
  const files = req.files?.map((file) => file.filename);
  try {
    const postData = {
      planning,
      postDate,
      platform,
      platformId,
      caption,
      labels,
      notes,
      boostBudget,
      workspaceId,
      postMedia: files,
      approvalStatus,
    };
    const newPost = await postService.createPost(postData);
    // Post immediately if planning is set to "now"
    if (planning.toLowerCase() === "now") {
      const socialMediaIds = platformId.split(",");
      for (const id of socialMediaIds) {
        try {
          const accountId = new mongoose.Types.ObjectId(id);
          const socialMediaAccount =
            await socialMediaAccountsService.getSocialMediaAccountById(
              accountId
            );
          if (socialMediaAccount) {
            // Get file paths of all uploaded media files
            const filePaths = req.files
              ? req.files.map((file) => file.path)
              : [];
            // Extract credentials from the social media account
            const credentials = {
              appId: socialMediaAccount.appId,
              appSecret: socialMediaAccount.appSecret,
              accessToken: socialMediaAccount.accessToken,
              userAccessToken: socialMediaAccount.userAccessToken,
              pageId: socialMediaAccount.pageId,
              userId: socialMediaAccount.userId,
              authorUrn: socialMediaAccount.authorUrn,
            };
            // Use the unified service to post to any platform
            const platformPostId = await socialPostingService.postToSocialMedia(
              socialMediaAccount.platform,
              caption,
              filePaths,
              credentials
            );
            // Update post with platform-specific ID
            if (platformPostId) {
              console.log(
                `Successfully posted to ${socialMediaAccount.platform}, ID:`,
                platformPostId
              );
              // Update with platform post ID in DB
              await postService.updatePost(newPost._id, {
                platformId: platformPostId,
              });
            }
          }
        } catch (error) {
          console.error(`Error posting to social media:`, error.message);
          // Handle rate limits specially
          if (error.message.includes("rate limit")) {
            await postService.updatePost(newPost._id, {
              approvalStatus: "rate-limited",
            });
          }
        }
      }
    }
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Failed to create post" });
  }
};
// exports.getPosts = async (req, res) => {
//   try {
//     const posts = await postService.getPosts();
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error fetching posts:", error.message);
//     res.status(500).json({ message: "Failed to fetch posts" });
//   }
// };
// exports.getPostById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const post = await postService.getPostById(id);
//     res.status(200).json(post);
//   } catch (error) {
//     console.error("Error fetching post by ID:", error.message);
//     res.status(500).json({ message: "Failed to fetch post by ID" });
//   }
// };
// exports.updatePost = async (req, res) => {
//   const { id } = req.params;
//   const postData = req.body;
//   try {
//     const updatedPost = await postService.updatePost(id, postData);
//     res.status(200).json(updatedPost);
//   } catch (error) {
//     console.error("Error updating post:", error.message);
//     res.status(500).json({ message: "Failed to update post" });
//   }
// };
// exports.deletePost = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await postService.deletePost(id);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error deleting post:", error.message);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };
