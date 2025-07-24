const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

//  endpoints
router.post("/create", workspaceController.createWorkspace);        // POST
router.get("/getall", workspaceController.getAllWorkspaces);       // GET
router.get("/getbyid/:id", workspaceController.getWorkspaceById);  // GET
router.put("/update/:id", workspaceController.updateWorkspace);    // PUT
router.delete("/delete/:id", workspaceController.deleteWorkspace); // DELETE

module.exports = router;

