const postMedia = require('../models/postMediaModel');

const createPostMediaForFiles = async function (postId, files, socialMediaInfo) {
  try {
    const fileRecords = files.map(f => ({
      url: `/uploads/${f.filename}`,
      type: f.mimetype.startsWith("video") ? "video" : "image",
      mimetype: f.mimetype,
      filename: f.filename,
    }));

    const mediaPayload = {
      postId,
      socialMedia: socialMediaInfo,
      files: fileRecords,
    };

    const newPostMedia = new postMedia(mediaPayload);
    await newPostMedia.save();
    return newPostMedia;
  } catch (error) {
    console.error('Error creating postMedia:', error.message);
    throw new Error('Failed to create postMedia');
  }
};

// old create method
// const createPostMedia = async function(postMediaData) {
//   try {
//     const newPostMedia = new postMedia(postMediaData);
//     await newPostMedia.save();
//     return newPostMedia;
//   } catch (error) {
//     console.error('Error creating postMedia:', error.message);
//     throw new Error('Failed to create postMedia');
//   }
// }

 
const getPosMediatByPostId = async function(postId) {
    try {
        const post = await postMedia.findById(postId);
        return post;
    } catch (error) {
        console.error('Error fetching postMedia by ID:', error.message);
        throw new Error('Failed to fetch postMedia by ID');
    }
    }
 

    module.exports = { createPostMediaForFiles, getPosMediatByPostId,  };


// Old Post Media Service

// const postMedia = require('../models/postMediaModel');
// const createPostMedia = async function(postMediaData) {
//   try {
//     const newPostMedia = new postMedia(postMediaData);
//     await newPostMedia.save();
//     return newPostMedia;
//   } catch (error) {
//     console.error('Error creating postMedia:', error.message);
//     throw new Error('Failed to create postMedia');
//   }
// }
// const getPosMediatByPostId = async function(postId) {
//     try {
//         const post = await postMedia.findById(postId);
//         return post;
//     } catch (error) {
//         console.error('Error fetching postMedia by ID:', error.message);
//         throw new Error('Failed to fetch postMedia by ID');
//     }
//     }
//     module.exports = { createPostMedia, getPosMediatByPostId,  };