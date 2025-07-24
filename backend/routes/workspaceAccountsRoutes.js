const express = require('express');
const router = express.Router();
const {
  createWorkspaceAccount,
  getWorkspaceAccountById
} = require('../controllers/WorkspaceAccountsController');


router.post('/createworkspaceaccount/', createWorkspaceAccount);
router.get('/getworkspaceaccounts/:workspaceId', getWorkspaceAccountById);

module.exports = router;
