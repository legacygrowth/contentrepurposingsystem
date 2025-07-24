const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.post("/createmember", memberController.createMember);
router.get("/getallmember", memberController.getAllMembers);
router.get("/getmemberid/:id", memberController.getMemberById);
router.put("/updatemember/:id", memberController.updateMember);
router.delete("/deletemember/:id", memberController.deleteMember);

module.exports = router;
