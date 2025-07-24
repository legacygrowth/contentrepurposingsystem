const facebookService = require("../services/facebookService");
const socialMediaAccountsService = require("../services/socialMediaAccountsService");
const postService = require("../services/postService");
const axios = require("axios");

// Helper function to validate Facebook page access
const validateFacebookPageAccess = async (pageId, accessToken) => {
  try {
    // First get the user's accounts (pages) they have access to
    const accountsResponse = await axios.get(
      "https://graph.facebook.com/v19.0/me/accounts",
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token,tasks",
        },
      }
    );

    // Find the specific page we want to post to
    const targetPage = accountsResponse.data.data.find(
      (page) => page.id === pageId
    );

    if (!targetPage) {
      throw new Error(
        `No access to page with ID ${pageId}. Please verify the page ID and ensure you have admin access.`
      );
    }

    // Verify minimum required page tasks
    const requiredTasks = ["CREATE_CONTENT", "MANAGE"];
    const pageTasks = targetPage.tasks || [];

    const missingTasks = requiredTasks.filter(
      (task) => !pageTasks.includes(task)
    );

    if (missingTasks.length > 0) {
      throw new Error(
        `Missing required page permissions: ${missingTasks.join(
          ", "
        )}. Please ensure you have sufficient admin rights on the page.`
      );
    }

    // Get detailed page information
    const pageResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}`,
      {
        params: {
          fields: "id,name,access_token",
          access_token: targetPage.access_token,
        },
      }
    );

    return {
      id: pageResponse.data.id,
      name: pageResponse.data.name,
      access_token: targetPage.access_token, // Use the page access token from /me/accounts
    };
  } catch (error) {
    console.error(
      "Error validating Facebook page:",
      error.response?.data || error
    );

    // Handle specific Facebook API errors
    if (error.response?.data?.error) {
      const fbError = error.response.data.error;
      switch (fbError.code) {
        case 190:
          throw new Error(
            "Invalid or expired access token. Please reconnect your Facebook account."
          );
        case 200:
          throw new Error(
            "Invalid Facebook app configuration. Please verify your app ID and secret."
          );
        case 100:
          throw new Error(
            "Invalid page access. Please verify your page ID and permissions."
          );
        default:
          throw new Error(`Facebook API Error: ${fbError.message}`);
      }
    }

    throw error;
  }
};

exports.postTextOnFacebook = async (req, res) => {
  const { message, pageId } = req.body;

  try {
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Invalid message format",
        details: "Message must be a non-empty string",
      });
    }

    if (!pageId) {
      return res.status(400).json({
        error: "Missing page ID",
        details: "A valid Facebook page ID is required",
      });
    }

    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({
        error: "Facebook account not found",
        details: "No Facebook account found with the provided page ID",
      });
    }

    try {
      // First validate direct page access with the current token
      try {
        await facebookService.validatePageAccess(
          pageId,
          socialMediaAccount.accessToken
        );
        console.log("Direct page access validation succeeded");
      } catch (pageError) {
        console.log("Direct validation failed:", pageError.message);
      }

      // Get a fresh page access token
      const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
        socialMediaAccount.accessToken,
        pageId
      );

      const credentials = {
        accessToken: pageAccessToken,
        pageId: pageId,
        appId: socialMediaAccount.appId,
        appSecret: socialMediaAccount.appSecret,
      };

      const postId = await facebookService.postTextToFacebook(
        message,
        credentials
      );

      // Save to Post model
      const postData = {
        planning: "now",
        postDate: new Date(),
        platform: "facebook",
        platformId: postId,
        caption: message,
        workspaceId: socialMediaAccount.workspaceId || req.body.workspaceId,
        approvalStatus: "published",
      };

      // Save the post to database
      const savedPost = await postService.createPost(postData);

      res.json({
        success: true,
        postId,
        postDbId: savedPost._id,
        page: {
          id: pageId,
        },
      });
    } catch (error) {
      console.error("Facebook API error details:", error);
      return res.status(400).json({
        error: "Facebook validation failed",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error posting text on Facebook:", error);
    res.status(500).json({
      error: "Failed to post text on Facebook",
      details: error.message,
    });
  }
};

exports.postImagesByURLOnFacebook = async (req, res) => {
  const { message, imageUrl, pageId, workspaceId } = req.body;

  try {
    // Input validation
    if (!workspaceId) {
      return res.status(400).json({
        error: "Missing workspace ID",
        details: "A workspaceId is required for creating posts",
      });
    }

    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({ error: "Facebook account not found" });
    }

    // Validate page access
    try {
      // Get a fresh page access token
      const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
        socialMediaAccount.accessToken,
        pageId
      );

      const credentials = {
        accessToken: pageAccessToken,
        pageId: pageId,
        appId: socialMediaAccount.appId,
        appSecret: socialMediaAccount.appSecret,
      };

      const postId = await facebookService.postImageByURLToFacebook(
        message,
        imageUrl,
        credentials
      );

      // Save to Post model
      const postData = {
        planning: "now",
        postDate: new Date(),
        platform: "facebook",
        platformId: postId,
        caption: message,
        workspaceId: workspaceId,
        approvalStatus: "published",
      };

      // Save the post to database
      const savedPost = await postService.createPost(postData);

      res.json({
        success: true,
        postId,
        postDbId: savedPost._id,
        page: {
          id: pageId,
        },
      });
    } catch (error) {
      console.error("Facebook API error details:", error);
      return res.status(400).json({
        error: "Facebook validation failed",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error posting image on Facebook:", error);
    res.status(500).json({ error: "Failed to post image on Facebook" });
  }
};

exports.postImagesByFileOnFacebook = async (req, res) => {
  const { message, pageId, workspaceId } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: "No image file provided" });
  }

  if (!workspaceId) {
    return res.status(400).json({
      error: "Missing workspace ID",
      details: "A workspaceId is required for creating posts",
    });
  }

  try {
    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({ error: "Facebook account not found" });
    }

    // Get a fresh page access token
    const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
      socialMediaAccount.accessToken,
      pageId
    );

    const credentials = {
      accessToken: pageAccessToken,
      pageId: pageId,
      appId: socialMediaAccount.appId,
      appSecret: socialMediaAccount.appSecret,
    };

    const postId = await facebookService.postImageToFacebook(
      message,
      imageFile.path,
      credentials
    );

    // Save to Post model
    const postData = {
      planning: "now",
      postDate: new Date(),
      platform: "facebook",
      platformId: postId,
      caption: message,
      workspaceId: workspaceId,
      approvalStatus: "published",
      postMedia: [imageFile.filename], // Store the image filename
    };

    // Save the post to database
    const savedPost = await postService.createPost(postData);

    res.json({
      success: true,
      postId,
      postDbId: savedPost._id,
      page: {
        id: pageId,
      },
    });
  } catch (error) {
    console.error("Error posting image on Facebook:", error);
    res.status(500).json({
      error: "Failed to post image on Facebook",
      details: error.message,
    });
  }
};

exports.postVideoOnFacebook = async (req, res) => {
  const { message, pageId, workspaceId } = req.body;
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({ error: "No video file provided" });
  }

  if (!workspaceId) {
    return res.status(400).json({
      error: "Missing workspace ID",
      details: "A workspaceId is required for creating posts",
    });
  }

  try {
    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({ error: "Facebook account not found" });
    }

    // Get a fresh page access token
    const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
      socialMediaAccount.accessToken,
      pageId
    );

    const credentials = {
      accessToken: pageAccessToken,
      pageId: pageId,
      appId: socialMediaAccount.appId,
      appSecret: socialMediaAccount.appSecret,
    };

    const postId = await facebookService.postVideoToFacebook(
      message,
      videoFile.path,
      credentials
    );

    // Save to Post model
    const postData = {
      planning: "now",
      postDate: new Date(),
      platform: "facebook",
      platformId: postId,
      caption: message,
      workspaceId: workspaceId,
      approvalStatus: "published",
      postMedia: [videoFile.filename], // Store the video filename
    };

    // Save the post to database
    const savedPost = await postService.createPost(postData);

    res.json({
      success: true,
      postId,
      postDbId: savedPost._id,
      page: {
        id: pageId,
      },
    });
  } catch (error) {
    console.error("Error posting video on Facebook:", error);
    res.status(500).json({
      error: "Failed to post video on Facebook",
      details: error.message,
    });
  }
};

exports.postImagesOnFacebook = async (req, res) => {
  const { message, pageId, workspaceId } = req.body;
  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    return res.status(400).json({ error: "No image files provided" });
  }

  if (!workspaceId) {
    return res.status(400).json({
      error: "Missing workspace ID",
      details: "A workspaceId is required for creating posts",
    });
  }

  try {
    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({ error: "Facebook account not found" });
    }

    // Get a fresh page access token
    const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
      socialMediaAccount.accessToken,
      pageId
    );

    const credentials = {
      accessToken: pageAccessToken,
      pageId: pageId,
      appId: socialMediaAccount.appId,
      appSecret: socialMediaAccount.appSecret,
    };

    let postId;
    // Handle single or multiple images
    if (files.length === 1) {
      // Single image case
      postId = await facebookService.postImageToFacebook(
        message,
        files[0].path,
        credentials
      );
    } else {
      // Multiple images case
      const imagePaths = files.map((file) => file.path);
      postId = await facebookService.postMultipleImagesToFacebook(
        message,
        imagePaths,
        credentials
      );

      // Extract the main post ID from the result object
      postId = postId.mainPostId;
    }

    // Save to Post model
    const postData = {
      planning: "now",
      postDate: new Date(),
      platform: "facebook",
      platformId: postId,
      caption: message,
      workspaceId: workspaceId,
      approvalStatus: "published",
      postMedia: files.map((file) => file.filename), // Store all image filenames
    };

    // Save the post to database
    const savedPost = await postService.createPost(postData);

    res.json({
      success: true,
      postId,
      postDbId: savedPost._id,
      imageCount: files.length,
      page: {
        id: pageId,
      },
    });
  } catch (error) {
    console.error("Error posting images to Facebook:", error);
    res.status(500).json({
      error: "Failed to post images to Facebook",
      details: error.message,
    });
  }
};

exports.postVideosOnFacebook = async (req, res) => {
  const { message, pageId, workspaceId } = req.body;
  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    return res.status(400).json({ error: "No video files provided" });
  }

  if (!workspaceId) {
    return res.status(400).json({
      error: "Missing workspace ID",
      details: "A workspaceId is required for creating posts",
    });
  }

  try {
    // Get the social media account for Facebook
    const socialMediaAccount =
      await socialMediaAccountsService.getSocialMediaAccountByPageId(pageId);

    if (!socialMediaAccount) {
      return res.status(404).json({ error: "Facebook account not found" });
    }

    // Get a fresh page access token
    const pageAccessToken = await facebookService.getLongLivedPageAccessToken(
      socialMediaAccount.accessToken,
      pageId
    );

    const credentials = {
      accessToken: pageAccessToken,
      pageId: pageId,
      appId: socialMediaAccount.appId,
      appSecret: socialMediaAccount.appSecret,
    };

    let postId;
    let allPostIds = [];

    // Handle single or multiple videos
    if (files.length === 1) {
      // Single video case
      postId = await facebookService.postVideoToFacebook(
        message,
        files[0].path,
        credentials
      );
      allPostIds = [postId];
    } else {
      // Multiple videos case
      const videoPaths = files.map((file) => file.path);
      const result = await facebookService.postMultipleVideosToFacebook(
        message,
        videoPaths,
        credentials
      );

      postId = result.mainPostId;
      allPostIds = result.allPostIds;
    }

    // Save to Post model
    const postData = {
      planning: "now",
      postDate: new Date(),
      platform: "facebook",
      platformId: postId,
      caption: message,
      workspaceId: workspaceId,
      approvalStatus: "published",
      postMedia: files.map((file) => file.filename), // Store all video filenames
    };

    // Save the post to database
    const savedPost = await postService.createPost(postData);

    res.json({
      success: true,
      postId,
      postDbId: savedPost._id,
      videoCount: files.length,
      allPostIds: allPostIds,
      page: {
        id: pageId,
      },
    });
  } catch (error) {
    console.error("Error posting videos to Facebook:", error);
    res.status(500).json({
      error: "Failed to post videos to Facebook",
      details: error.message,
    });
  }
};
