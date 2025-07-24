const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

// Handle Instagram-specific error handling
const handleInstagramError = (error) => {
  if (error?.response?.data?.error) {
    return `Instagram API Error: ${error.response.data.error.message}`;
  }
  return error.message || "Unknown Instagram error";
};

// Instagram doesn't support text-only posts, this function will throw an error
const postTextToInstagram = async (message, credentials = {}) => {
  throw new Error("Instagram does not support text-only posts without media");
};

// Post image to Instagram from a URL
const postImageFromURLToInstagram = async (
  message,
  imageUrl,
  credentials = {}
) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
    const userId =
      credentials.userId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    // Step 1: Create media container
    const media = await axios.post(
      `https://graph.instagram.com/v19.0/${userId}/media`,
      {
        image_url: imageUrl,
        caption: message,
      },
      {
        params: { access_token: accessToken },
      }
    );

    // Step 2: Publish media container
    const publish = await axios.post(
      `https://graph.instagram.com/v19.0/${userId}/media_publish`,
      {
        creation_id: media.data.id,
      },
      {
        params: { access_token: accessToken },
      }
    );

    return publish.data.id;
  } catch (error) {
    console.error(
      "Instagram Image URL Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleInstagramError(error);
    throw new Error(errorMessage);
  }
};

// Post image to Instagram (needs URL upload, so requires a helper function)
const postImageToInstagram = async (message, imagePath, credentials = {}) => {
  try {
    // For production use, you would first upload the image to a CDN/storage service
    // and then get a publicly accessible URL

    // This is a placeholder for the CDN upload function
    const imageUrl = await uploadToPublicUrl(imagePath);

    // After getting the URL, use the URL-based function
    return await postImageFromURLToInstagram(message, imageUrl, credentials);
  } catch (error) {
    console.error(
      "Instagram Image Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleInstagramError(error);
    throw new Error(errorMessage);
  }
};

// Post video to Instagram from URL
const postVideoToInstagram = async (message, videoPath, credentials = {}) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
    const userId =
      credentials.userId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    // For production use, upload the video to a CDN/storage service first
    const videoUrl = await uploadToPublicUrl(videoPath);

    // Create container
    const media = await axios.post(
      `https://graph.facebook.com/v19.0/${userId}/media`,
      {
        media_type: "VIDEO",
        video_url: videoUrl,
        caption: message,
      },
      {
        params: { access_token: accessToken },
      }
    );

    // Check status
    let status = null;
    let attempts = 0;

    while (attempts < 10) {
      const statusCheck = await axios.get(
        `https://graph.facebook.com/v19.0/${media.data.id}`,
        {
          params: {
            access_token: accessToken,
            fields: "status_code",
          },
        }
      );

      if (statusCheck.data.status_code === "FINISHED") {
        status = "FINISHED";
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      attempts++;
    }

    if (status !== "FINISHED") {
      throw new Error("Video processing timed out");
    }

    // Publish
    const publish = await axios.post(
      `https://graph.facebook.com/v19.0/${userId}/media_publish`,
      {
        creation_id: media.data.id,
      },
      {
        params: { access_token: accessToken },
      }
    );

    return publish.data.id;
  } catch (error) {
    console.error(
      "Instagram Video Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleInstagramError(error);
    throw new Error(errorMessage);
  }
};

// Post multiple images to Instagram as a carousel
const postMultipleImagesToInstagram = async (
  message,
  imagePaths,
  credentials = {}
) => {
  try {
    const accessToken =
      credentials.accessToken || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
    const userId =
      credentials.userId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    // Upload all images to get public URLs
    const imageUrls = [];
    for (const imagePath of imagePaths) {
      const url = await uploadToPublicUrl(imagePath);
      imageUrls.push(url);
    }

    // Create carousel container
    const media = await axios.post(
      `https://graph.facebook.com/v19.0/${userId}/media`,
      {
        media_type: "CAROUSEL",
        caption: message,
        children: [], // Will be filled with child IDs after creation
      },
      {
        params: { access_token: accessToken },
      }
    );

    // Create child media objects
    const childrenIds = [];
    for (const imageUrl of imageUrls) {
      const childMedia = await axios.post(
        `https://graph.facebook.com/v19.0/${userId}/media`,
        {
          image_url: imageUrl,
          is_carousel_item: true,
        },
        {
          params: { access_token: accessToken },
        }
      );

      childrenIds.push(childMedia.data.id);
    }

    // Update carousel with children IDs
    await axios.post(
      `https://graph.facebook.com/v19.0/${media.data.id}`,
      {
        children: childrenIds.join(","),
      },
      {
        params: { access_token: accessToken },
      }
    );

    // Publish carousel
    const publish = await axios.post(
      `https://graph.facebook.com/v19.0/${userId}/media_publish`,
      {
        creation_id: media.data.id,
      },
      {
        params: { access_token: accessToken },
      }
    );

    return publish.data.id;
  } catch (error) {
    console.error(
      "Instagram Multiple Images Post Error:",
      error.response?.data || error.message
    );
    const errorMessage = handleInstagramError(error);
    throw new Error(errorMessage);
  }
};

// Helper function to upload file to a public URL (placeholder)
// This would need to be implemented with your chosen storage provider (S3, Cloudinary, etc.)
async function uploadToPublicUrl(filePath) {
  // This is a placeholder - in production, implement real file upload to CDN/storage
  throw new Error(
    "uploadToPublicUrl not implemented - please add your own implementation"
  );

  // Example implementation with AWS S3:
  /*
  const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
  
  const client = new S3Client({ region: process.env.AWS_REGION });
  const fileContent = fs.readFileSync(filePath);
  const fileKey = `uploads/${Date.now()}-${path.basename(filePath)}`;
  
  await client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: fileContent,
    ContentType: mime.lookup(filePath)
  }));
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;
  */
}

module.exports = {
  postTextToInstagram,
  postImageToInstagram,
  postImageFromURLToInstagram,
  postVideoToInstagram,
  postMultipleImagesToInstagram,
};
