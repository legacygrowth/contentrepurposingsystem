const sysWorkspaceUserService=require("../services/workspaceUserService")

exports.createWorkspaceUser=async(req,res)=>{
    try {
        const {workspaceId,userId}=req.body;
        const user=await sysWorkspaceUserService.createWorkspaceUser(workspaceId,userId)
        res.status(201).json({message:"workspace user  created successfully",data:user})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.getAllWorkspaceUsers=async(req,res)=>{
    try {
        const users=await sysWorkspaceUserService.getAllWorkspaceUsers();
         res.status(201).json({message:"workspace user  fetch successfully",data:user})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}