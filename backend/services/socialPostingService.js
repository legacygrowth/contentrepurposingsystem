const facebookService = require("./facebookService");
const twitterService = require("./twitterService");
const instagramService = require("./instagramService");
const linkedinService = require("./linkedinService");
const path = require("path");
require("dotenv").config();
/**
 * Unified service for posting to any social media platform
 * This follows the DRY principle by abstracting platform-specific logic
 */
// Helper to determine file type (image, video, etc.)
const getMediaType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (videoExtensions.includes(extension)) return "video";
  if (imageExtensions.includes(extension)) return "image";
  return "unknown";
};
/**
 * Post to any social media platform with dynamic credentials
 * @param {string} platform - Social media platform (facebook, twitter, instagram, linkedin)
 * @param {string} message - Post text/caption
 * @param {Array} mediaFiles - Array of media file paths
 * @param {Object} credentials - Platform-specific credentials
 * @returns {Promise<string>} Post ID from the platform
 */
const postToSocialMedia = async (
  platform,
  message,
  mediaFiles = [],
  credentials = {},
  clientCredentials
) => {
  // Normalize platform name
  const platformLower = platform.toLowerCase();
  try {
    // Handle different posting scenarios based on platform and media
    switch (platformLower) {
      case "facebook":
        return await postToFacebook(message, mediaFiles, credentials);
      case "twitter":
        return await postToTwitter(
          message,
          mediaFiles,
          credentials,
          clientCredentials
        );
      case "instagram":
        return await postToInstagram(message, mediaFiles, credentials);
      case "linkedin":
        return await postToLinkedIn(message, mediaFiles, credentials);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error.message);
    throw error;
  }
};
/**
 * Post to Facebook with appropriate media handling
 */
const postToFacebook = async (message, mediaFiles, credentials) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    // Text-only post
    return await facebookService.postTextToFacebook(message, credentials);
  } else if (mediaFiles.length === 1) {
    // Single media post
    const filePath = mediaFiles[0];
    const mediaType = getMediaType(filePath);
    if (mediaType === "video") {
      return await facebookService.postVideoToFacebook(
        message,
        filePath,
        credentials
      );
    } else {
      return await facebookService.postImageToFacebook(
        message,
        filePath,
        credentials
      );
    }
  } else {
    // Multiple media post
    return await facebookService.postMultipleImagesToFacebook(
      message,
      mediaFiles,
      credentials
    );
  }
};
/**
 * Post to Twitter with appropriate media handling
 */
const postToTwitter = async (
  message,
  mediaFiles,
  credentials,
  clientCredentials
) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    // Text-only post
    return await twitterService.postTextToTwitter(
      message,
      credentials,
      clientCredentials
    );
  } else if (mediaFiles.length === 1) {
    // Single media post
    const filePath = mediaFiles[0];
    const mediaType = getMediaType(filePath);
    if (mediaType === "video") {
      return await twitterService.postVideoToTwitter(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    } else {
      return await twitterService.postImageToTwitter(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    }
  } else {
    // Check if all are images for multiple image post
    const allImages = mediaFiles.every(
      (file) => getMediaType(file) === "image"
    );
    if (allImages) {
      return await twitterService.postMultipleImagesToTwitter(
        message,
        mediaFiles,
        credentials,
        clientCredentials
      );
    } else {
      // Twitter doesn't support mixed media types, so we'll use the first file
      const filePath = mediaFiles[0];
      const mediaType = getMediaType(filePath);
      if (mediaType === "video") {
        return await twitterService.postVideoToTwitter(
          message,
          filePath,
          credentials,
          clientCredentials
        );
      } else {
        return await twitterService.postImageToTwitter(
          message,
          filePath,
          credentials,
          clientCredentials
        );
      }
    }
  }
};
/**
 * Post to Instagram with appropriate media handling
 */
const postToInstagram = async (
  message,
  mediaFiles,
  credentials,
  clientCredentials
) => {
  // Instagram doesn't support text-only posts
  if (!mediaFiles || mediaFiles.length === 0) {
    throw new Error("Instagram requires media files for posting");
  } else if (mediaFiles.length === 1) {
    // Single media post
    const filePath = mediaFiles[0];
    const mediaType = getMediaType(filePath);
    if (mediaType === "video") {
      return await instagramService.postVideoToInstagram(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    } else {
      return await instagramService.postImageToInstagram(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    }
  } else {
    // Multiple images as carousel
    return await instagramService.postMultipleImagesToInstagram(
      message,
      mediaFiles,
      credentials,
      clientCredentials
    );
  }
};
/**
 * Post to LinkedIn with appropriate media handling
 */
const postToLinkedIn = async (
  message,
  mediaFiles,
  credentials,
  clientCredentials
) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    // Text-only post
    return await linkedinService.postTextToLinkedIn(
      message,
      credentials,
      clientCredentials
    );
  } else if (mediaFiles.length === 1) {
    // Single media post
    const filePath = mediaFiles[0];
    const mediaType = getMediaType(filePath);
    if (mediaType === "video") {
      return await linkedinService.postVideoToLinkedIn(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    } else {
      return await linkedinService.postImageToLinkedIn(
        message,
        filePath,
        credentials,
        clientCredentials
      );
    }
  } else {
    // LinkedIn doesn't support multiple images, use first image
    return await linkedinService.postImageToLinkedIn(
      message,
      mediaFiles[0],
      credentials,
      clientCredentials
    );
  }
};
module.exports = {
  postToSocialMedia,
};


// Old Social Posting Service

// const facebookService = require("./facebookService");
// const twitterService = require("./twitterService");
// const instagramService = require("./instagramService");
// const linkedinService = require("./linkedinService");
// const path = require("path");
// require("dotenv").config();
// /**
//  * Unified service for posting to any social media platform
//  * This follows the DRY principle by abstracting platform-specific logic
//  */
// // Helper to determine file type (image, video, etc.)
// const getMediaType = (filePath) => {
//   const extension = path.extname(filePath).toLowerCase();
//   const videoExtensions = [".mp4", ".mov", ".avi", ".wmv", ".flv"];
//   const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
//   if (videoExtensions.includes(extension)) return "video";
//   if (imageExtensions.includes(extension)) return "image";
//   return "unknown";
// };
// /**
//  * Post to any social media platform with dynamic credentials
//  * @param {string} platform - Social media platform (facebook, twitter, instagram, linkedin)
//  * @param {string} message - Post text/caption
//  * @param {Array} mediaFiles - Array of media file paths
//  * @param {Object} credentials - Platform-specific credentials
//  * @returns {Promise<string>} Post ID from the platform
//  */
// const postToSocialMedia = async (
//   platform,
//   message,
//   mediaFiles = [],
//   credentials = {}
// ) => {
//   // Normalize platform name
//   const platformLower = platform.toLowerCase();
//   try {
//     // Handle different posting scenarios based on platform and media
//     switch (platformLower) {
//       case "facebook":
//         return await postToFacebook(message, mediaFiles, credentials);
//       case "twitter":
//         return await postToTwitter(message, mediaFiles, credentials);
//       case "instagram":
//         return await postToInstagram(message, mediaFiles, credentials);
//       case "linkedin":
//         return await postToLinkedIn(message, mediaFiles, credentials);
//       default:
//         throw new Error(`Unsupported platform: ${platform}`);
//     }
//   } catch (error) {
//     console.error(`Error posting to ${platform}:`, error.message);
//     throw error;
//   }
// };
// /**
//  * Post to Facebook with appropriate media handling
//  */
// const postToFacebook = async (message, mediaFiles, credentials) => {
//   if (!mediaFiles || mediaFiles.length === 0) {
//     // Text-only post
//     return await facebookService.postTextToFacebook(message, credentials);
//   } else if (mediaFiles.length === 1) {
//     // Single media post
//     const filePath = mediaFiles[0];
//     const mediaType = getMediaType(filePath);
//     if (mediaType === "video") {
//       return await facebookService.postVideoToFacebook(
//         message,
//         filePath,
//         credentials
//       );
//     } else {
//       return await facebookService.postImageToFacebook(
//         message,
//         filePath,
//         credentials
//       );
//     }
//   } else {
//     // Multiple media post
//     return await facebookService.postMultipleImagesToFacebook(
//       message,
//       mediaFiles,
//       credentials
//     );
//   }
// };
// /**
//  * Post to Twitter with appropriate media handling
//  */
// const postToTwitter = async (message, mediaFiles, credentials) => {
//   if (!mediaFiles || mediaFiles.length === 0) {
//     // Text-only post
//     return await twitterService.postTextToTwitter(message, credentials);
//   } else if (mediaFiles.length === 1) {
//     // Single media post
//     const filePath = mediaFiles[0];
//     const mediaType = getMediaType(filePath);
//     if (mediaType === "video") {
//       return await twitterService.postVideoToTwitter(
//         message,
//         filePath,
//         credentials
//       );
//     } else {
//       return await twitterService.postImageToTwitter(
//         message,
//         filePath,
//         credentials
//       );
//     }
//   } else {
//     // Check if all are images for multiple image post
//     const allImages = mediaFiles.every(
//       (file) => getMediaType(file) === "image"
//     );
//     if (allImages) {
//       return await twitterService.postMultipleImagesToTwitter(
//         message,
//         mediaFiles,
//         credentials
//       );
//     } else {
//       // Twitter doesn't support mixed media types, so we'll use the first file
//       const filePath = mediaFiles[0];
//       const mediaType = getMediaType(filePath);
//       if (mediaType === "video") {
//         return await twitterService.postVideoToTwitter(
//           message,
//           filePath,
//           credentials
//         );
//       } else {
//         return await twitterService.postImageToTwitter(
//           message,
//           filePath,
//           credentials
//         );
//       }
//     }
//   }
// };
// /**
//  * Post to Instagram with appropriate media handling
//  */
// const postToInstagram = async (message, mediaFiles, credentials) => {
//   // Instagram doesn't support text-only posts
//   if (!mediaFiles || mediaFiles.length === 0) {
//     throw new Error("Instagram requires media files for posting");
//   } else if (mediaFiles.length === 1) {
//     // Single media post
//     const filePath = mediaFiles[0];
//     const mediaType = getMediaType(filePath);
//     if (mediaType === "video") {
//       return await instagramService.postVideoToInstagram(
//         message,
//         filePath,
//         credentials
//       );
//     } else {
//       return await instagramService.postImageToInstagram(
//         message,
//         filePath,
//         credentials
//       );
//     }
//   } else {
//     // Multiple images as carousel
//     return await instagramService.postMultipleImagesToInstagram(
//       message,
//       mediaFiles,
//       credentials
//     );
//   }
// };
// /**
//  * Post to LinkedIn with appropriate media handling
//  */
// const postToLinkedIn = async (message, mediaFiles, credentials) => {
//   if (!mediaFiles || mediaFiles.length === 0) {
//     // Text-only post
//     return await linkedinService.postTextToLinkedIn(message, credentials);
//   } else if (mediaFiles.length === 1) {
//     // Single media post
//     const filePath = mediaFiles[0];
//     const mediaType = getMediaType(filePath);
//     if (mediaType === "video") {
//       return await linkedinService.postVideoToLinkedIn(
//         message,
//         filePath,
//         credentials
//       );
//     } else {
//       return await linkedinService.postImageToLinkedIn(
//         message,
//         filePath,
//         credentials
//       );
//     }
//   } else {
//     // LinkedIn doesn't support multiple images, use first image
//     return await linkedinService.postImageToLinkedIn(
//       message,
//       mediaFiles[0],
//       credentials
//     );
//   }
// };
// module.exports = {
//   postToSocialMedia,
// };