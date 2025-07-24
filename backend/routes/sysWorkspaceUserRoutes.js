const express=require("express")
const router=express.Router()
const sysWorkspaceUserController =require("../controllers/sysWorkspaceUserController")

router.post('/create',sysWorkspaceUserController.createWorkspaceUser)
router.get('/getAllWorkspaceUser',sysWorkspaceUserController.getAllWorkspaceUsers)


module.exports=router;