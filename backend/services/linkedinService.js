const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// Handle LinkedIn-specific error handling
const handleLinkedInError = (error) => {
  if (error?.response?.data?.serviceErrorCode) {
    return `LinkedIn API Error: ${
      error.response.data.message || error.response.data.serviceErrorCode
    }`;
  }
  return error.message || "Unknown LinkedIn error";
};

// Post text-only to LinkedIn
const postTextToLinkedIn = async (message, credentials = {}) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = credentials.authorUrn || process.env.LINKEDIN_AUTHOR_URN;

    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: message,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error(
      "LinkedIn Text Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleLinkedInError(error);
    throw new Error(errorMessage);
  }
};

// Post image to LinkedIn
const postImageToLinkedIn = async (message, imagePath, credentials = {}) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = credentials.authorUrn || process.env.LINKEDIN_AUTHOR_URN;

    // Step 1: Register upload
    const register = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          owner: authorUrn,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    const uploadUrl =
      register.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = register.data.value.asset;

    // Step 2: Upload image binary
    const imageData = fs.readFileSync(imagePath);
    await axios.put(uploadUrl, imageData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    // Step 3: Create post
    const post = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: message,
            },
            shareMediaCategory: "IMAGE",
            media: [{ status: "READY", media: asset }],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    return post.data.id;
  } catch (error) {
    console.error(
      "LinkedIn Image Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleLinkedInError(error);
    throw new Error(errorMessage);
  }
};

// Post video to LinkedIn (requires special permissions)
const postVideoToLinkedIn = async (message, videoPath, credentials = {}) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = credentials.authorUrn || process.env.LINKEDIN_AUTHOR_URN;

    // Step 1: Register upload
    const register = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          owner: authorUrn,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    const uploadUrl =
      register.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = register.data.value.asset;

    // Step 2: Upload video binary
    const videoData = fs.readFileSync(videoPath);
    await axios.put(uploadUrl, videoData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    // Step 3: Create post (wait for video processing to complete)
    // In a production app, you'd need to poll the asset status
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for video processing

    const post = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: message,
            },
            shareMediaCategory: "VIDEO",
            media: [{ status: "READY", media: asset }],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    return post.data.id;
  } catch (error) {
    console.error(
      "LinkedIn Video Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleLinkedInError(error);
    throw new Error(errorMessage);
  }
};

// Post multiple images to LinkedIn (not directly supported)
const postMultipleImagesToLinkedIn = async (
  message,
  imagePaths,
  credentials = {}
) => {
  try {
    // LinkedIn doesn't support multiple images in one post
    // We'll use the first image
    if (imagePaths.length > 0) {
      return await postImageToLinkedIn(message, imagePaths[0], credentials);
    }
    throw new Error("No images provided for LinkedIn post");
  } catch (error) {
    console.error(
      "LinkedIn Multiple Images Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleLinkedInError(error);
    throw new Error(errorMessage);
  }
};

// Post article share to LinkedIn
const postArticleToLinkedIn = async (
  message,
  articleUrl,
  articleTitle,
  articleDesc,
  thumbnailUrl,
  credentials = {}
) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn = credentials.authorUrn || process.env.LINKEDIN_AUTHOR_URN;

    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: message,
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl: articleUrl,
                title: {
                  text: articleTitle,
                },
                description: {
                  text: articleDesc,
                },
                thumbnails: [
                  {
                    url: thumbnailUrl,
                  },
                ],
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error(
      "LinkedIn Article Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleLinkedInError(error);
    throw new Error(errorMessage);
  }
};

module.exports = {
  postTextToLinkedIn,
  postImageToLinkedIn,
  postVideoToLinkedIn,
  postMultipleImagesToLinkedIn,
  postArticleToLinkedIn,
};
