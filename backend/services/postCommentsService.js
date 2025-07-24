const PostComments = require("../models/postComments")

const insertComment = async (commentData) => {
  try {
    const comments = new PostComments(commentData);
    return await comments.save();
  } catch (error) {
    throw new Error("error inserting comment:" + error.message);
  }
};

const deleteCommentByID = async (commentId) => {
  try {
   const result=await PostComments.findByIdAndDelete(commentId)
   if(!result) throw new Error("comment not found");
   return result  
} catch (error) {
    throw new Error("Error deleting comments:"+error.message)
}
};

const getCommentByPostId=async(postId)=>{
try {
    return await PostComments.find({postID:postId})
} catch (error) {
    throw new Error("error fetching comments:"+ error.message)
}
};

module.exports ={
    insertComment,
    deleteCommentByID,
    getCommentByPostId,
}



