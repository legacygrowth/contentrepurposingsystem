const Post = require("../models/postModel");

const createPostWithTweetInfo = async function (tweet, postData) {
  try {
    const postPayload = {
      platform: "twitter",
      platformId: tweet?.data?.id || "",
      caption: postData.text,
      planning: "now",
      workspaceId: postData.workspaceId,
      userId: postData.userId,
      labels: postData.labels || "",
      notes: postData.notes || "",
      boostBudget: postData.boostBudget || 0,
      postMedia: postData.filenames,
    };

    const newPost = new Post(postPayload);
    await newPost.save();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw new Error("Failed to create post");
  }
};

// old create method
// const createPost = async function (postData) {
//   try {
//     const newPost = new Post(postData);
//     await newPost.save();
//     return newPost;
//   } catch (error) {
//     console.error("Error creating post:", error.message);
//     throw new Error("Failed to create post");
//   }
// };

const getPosts = async function () {
  try {
    const posts = await Post.find();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts");
  }
};

const getPostById = async function (postId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);
    throw new Error("Failed to fetch post by ID");
  }
};

const updatePost = async function (postId, postData) {
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
      new: true,
    });
    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error.message);
    throw new Error("Failed to update post");
  }
};

const deletePost = async function (postId) {
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new Error("Post not found");
    }
    return { message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error.message);
    throw new Error("Failed to delete post");
  }
};

module.exports = { createPostWithTweetInfo, getPosts, getPostById, updatePost, deletePost };


// Old Post Service

// const Post = require("../models/postModel");
// const createPost = async function (postData) {
//   try {
//     const newPost = new Post(postData);
//     await newPost.save();
//     return newPost;
//   } catch (error) {
//     console.error("Error creating post:", error.message);
//     throw new Error("Failed to create post");
//   }
// };
// const getPosts = async function () {
//   try {
//     const posts = await Post.find();
//     return posts;
//   } catch (error) {
//     console.error("Error fetching posts:", error.message);
//     throw new Error("Failed to fetch posts");
//   }
// };
// const getPostById = async function (postId) {
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       throw new Error("Post not found");
//     }
//     return post;
//   } catch (error) {
//     console.error("Error fetching post by ID:", error.message);
//     throw new Error("Failed to fetch post by ID");
//   }
// };
// const updatePost = async function (postId, postData) {
//   try {
//     const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
//       new: true,
//     });
//     if (!updatedPost) {
//       throw new Error("Post not found");
//     }
//     return updatedPost;
//   } catch (error) {
//     console.error("Error updating post:", error.message);
//     throw new Error("Failed to update post");
//   }
// };
// const deletePost = async function (postId) {
//   try {
//     const deletedPost = await Post.findByIdAndDelete(postId);
//     if (!deletedPost) {
//       throw new Error("Post not found");
//     }
//     return { message: "Post deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting post:", error.message);
//     throw new Error("Failed to delete post");
//   }
// };
// module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
