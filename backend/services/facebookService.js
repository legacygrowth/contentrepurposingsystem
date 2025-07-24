const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
require("dotenv").config();

// Remove hardcoded values and use environment variables
const {
  FACEBOOK_PAGE_ACCESS_TOKEN,
  FACEBOOK_APP_SECRET,
  FACEBOOK_PAGE_ID,
  FACEBOOK_CLIENT_TOKEN,
  FACEBOOK_APP_ID,
} = process.env;

// Handle Facebook-specific error handling
const handleFacebookError = (error) => {
  if (error?.response?.data?.error) {
    const fbError = error.response.data.error;
    if (fbError.code === 190) {
      return "Access token has expired or is invalid. Please reconnect your Facebook account.";
    }
    return `Facebook API Error: ${fbError.message}`;
  }
  return error.message || "Unknown Facebook error";
};

// Get long-lived page access token
const getLongLivedPageAccessToken = async (userAccessToken, pageId) => {
  try {
    // Check if token is already a page token by making a simple request
    try {
      const pageCheck = await axios.get(
        `https://graph.facebook.com/v19.0/${pageId}`,
        {
          params: {
            access_token: userAccessToken,
            fields: "id,name",
          },
        }
      );

      // If we can access page info with this token, it's likely already a page token
      if (pageCheck.data && pageCheck.data.id === pageId) {
        console.log("Token appears to be valid page token already");
        return userAccessToken;
      }
    } catch (e) {
      // Continue with user token flow if page check fails
      console.log("Token is not a valid page token, trying user token flow");
    }

    // First get all pages the user has access to
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/me/accounts`,
      {
        params: {
          access_token: userAccessToken,
          fields: "access_token,id,name",
        },
      }
    );

    // Find the specific page
    const page = response.data.data.find((p) => p.id === pageId);
    if (!page) {
      throw new Error(
        `No access to page with ID ${pageId}. Please verify the page ID and ensure you have admin access.`
      );
    }

    return page.access_token;
  } catch (error) {
    console.error(
      "Error getting page access token:",
      error.response?.data || error
    );
    throw new Error(handleFacebookError(error));
  }
};

// Validate Facebook Page access
const validatePageAccess = async (pageId, accessToken) => {
  try {
    // Try to get basic page info to validate access
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error validating page access:",
      error.response?.data || error
    );
    throw new Error(handleFacebookError(error));
  }
};

// Post text-only to Facebook
const postTextToFacebook = async function (message, credentials = {}) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // First validate page access
    await validatePageAccess(pageId, accessToken);

    const endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const response = await axios.post(
      endpoint,
      { message },
      { params: { access_token: accessToken } }
    );

    return response.data.id;
  } catch (error) {
    console.error("Facebook Post Error:", error.response?.data || error);
    throw new Error(handleFacebookError(error));
  }
};

// Post image to Facebook with a caption
const postImageToFacebook = async function (
  message,
  imagePath,
  credentials = {}
) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // Validate the page ID first
    await validatePageAccess(pageId, accessToken);

    // Create form data with the image
    const form = new FormData();
    form.append("caption", message);
    form.append("access_token", accessToken);
    form.append("source", fs.createReadStream(imagePath));

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${pageId}/photos`,
      form,
      { headers: form.getHeaders() }
    );

    return response.data.post_id || response.data.id;
  } catch (error) {
    console.error(
      "Facebook Image Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleFacebookError(error);
    throw new Error(errorMessage);
  }
};

// Post video to Facebook with a description
const postVideoToFacebook = async function (
  message,
  videoPath,
  credentials = {}
) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // Validate the page ID first
    await validatePageAccess(pageId, accessToken);

    const form = new FormData();
    form.append("access_token", accessToken);
    form.append("description", message);
    form.append("source", fs.createReadStream(videoPath));

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${pageId}/videos`,
      form,
      { headers: form.getHeaders() }
    );

    return response.data.id;
  } catch (error) {
    console.error(
      "Facebook Video Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleFacebookError(error);
    throw new Error(errorMessage);
  }
};

// Post image by URL with caption
const postImageByURLToFacebook = async function (
  message,
  imageUrl,
  credentials = {}
) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // Validate the page ID first
    await validatePageAccess(pageId, accessToken);

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${pageId}/photos`,
      {
        url: imageUrl,
        caption: message,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    return response.data.post_id || response.data.id;
  } catch (error) {
    console.error(
      "Facebook Image URL Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleFacebookError(error);
    throw new Error(errorMessage);
  }
};

// Post multiple images to Facebook in a single post
const postMultipleImagesToFacebook = async function (
  message,
  imagePaths,
  credentials = {}
) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // Validate the page ID first
    await validatePageAccess(pageId, accessToken);

    // First upload each image to get the photo IDs
    const uploadedPhotos = [];
    for (const imagePath of imagePaths) {
      try {
        const form = new FormData();
        form.append("access_token", accessToken);
        form.append("published", "false"); // Don't publish individual photos
        form.append("source", fs.createReadStream(imagePath));

        const response = await axios.post(
          `https://graph.facebook.com/v19.0/${pageId}/photos`,
          form,
          { headers: form.getHeaders() }
        );

        uploadedPhotos.push({ media_fbid: response.data.id });
      } catch (error) {
        console.error(
          `Error uploading photo ${imagePath}:`,
          error.response?.data || error
        );
        throw error;
      }
    }

    if (uploadedPhotos.length === 0) {
      throw new Error("Failed to upload any photos");
    }

    // Now create a feed post with all the uploaded photos attached
    try {
      const postData = {
        message: message,
        attached_media: uploadedPhotos,
      };

      const feedResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${pageId}/feed`,
        postData,
        { params: { access_token: accessToken } }
      );

      return {
        mainPostId: feedResponse.data.id,
        allPostIds: [feedResponse.data.id],
      };
    } catch (error) {
      console.error(
        "Error creating multi-photo post:",
        error.response?.data || error
      );
      throw error;
    }
  } catch (error) {
    console.error(
      "Facebook Multiple Images Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleFacebookError(error);
    throw new Error(errorMessage);
  }
};

// Post multiple videos to Facebook
const postMultipleVideosToFacebook = async function (
  message,
  videoPaths,
  credentials = {}
) {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId) {
      throw new Error("Facebook page ID is required");
    }

    // Validate the page ID first
    await validatePageAccess(pageId, accessToken);

    // Facebook doesn't support multiple videos in a single post like it does with images
    // So we'll post each video individually and return all the IDs
    const videoIds = [];

    // Post first video with the full message/caption
    if (videoPaths.length > 0) {
      const form = new FormData();
      form.append("description", message);
      form.append("access_token", accessToken);
      form.append("source", fs.createReadStream(videoPaths[0]));

      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${pageId}/videos`,
        form,
        { headers: form.getHeaders() }
      );

      const firstVideoId = response.data.id;
      videoIds.push(firstVideoId);

      // Post remaining videos with a reference to the first video
      for (let i = 1; i < videoPaths.length; i++) {
        const additionalMessage = `${message} (Video ${i + 1} of ${
          videoPaths.length
        })`;
        const form = new FormData();
        form.append("description", additionalMessage);
        form.append("access_token", accessToken);
        form.append("source", fs.createReadStream(videoPaths[i]));

        const response = await axios.post(
          `https://graph.facebook.com/v19.0/${pageId}/videos`,
          form,
          { headers: form.getHeaders() }
        );

        videoIds.push(response.data.id);
      }
    }

    // Return the ID of the first video as the main ID,
    // and include all IDs for reference
    return {
      mainPostId: videoIds[0] || null,
      allPostIds: videoIds,
    };
  } catch (error) {
    console.error(
      "Facebook Multiple Videos Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleFacebookError(error);
    throw new Error(errorMessage);
  }
};

module.exports = {
  postTextToFacebook,
  postImageToFacebook,
  postVideoToFacebook,
  postImageByURLToFacebook,
  postMultipleImagesToFacebook,
  postMultipleVideosToFacebook,
  getLongLivedPageAccessToken,
  validatePageAccess,
};
