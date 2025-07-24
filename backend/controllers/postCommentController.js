const PostCommentsService = require("../services/postCommentsService");

exports.insertComment = async (req, res) => {
  try {
    const commentData = req.body;
    const data = await PostCommentsService.insertComment(commentData);
    res.status(201).json({ message: "comment created successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PostCommentsService.deleteCommentByID(id);
    res.status(201).json({ message: "comment delete successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentByPostId=async (req,res)=>{
    try {
        const {postId}=req.params;
        const data=await PostCommentsService.getCommentByPostId(postId)
        res.status(201).json({message:"comment fetched succesfully",data})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
