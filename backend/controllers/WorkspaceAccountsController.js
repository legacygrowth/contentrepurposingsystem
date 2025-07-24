const workspaceAccountsService = require('../services/workspaceAccountsService');

exports.createWorkspaceAccount = async (req, res) => {
  const WorkspaceData = req.body;
  try {
    const workspaceAccounts = await workspaceAccountsService.createWorkspaceAccount(WorkspaceData);
    res.status(201).json(workspaceAccounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkspaceAccountById = async (req, res) => {
  const { workspaceId } = req.params;
  try {
const workspaceAccounts = await workspaceAccountsService.getWorkspaceAccountByWorkspaceId(workspaceId);

    if (!workspaceAccounts) {
      return res.status(404).json({ message: 'Workspace account not found' });
    }
    res.status(200).json(workspaceAccounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
