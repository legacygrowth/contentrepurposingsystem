const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const authenticateUserToken = require('../middleware/authMiddleware');

// Create a new agency
router.post('/createagency', agencyController.createAgency);

// Get all agencies
router.get('/getallagency', authenticateUserToken, agencyController.getAllAgencies);

// Get a single agency by ID
router.get('/getagency/:id', authenticateUserToken, agencyController.getAgencyById);

// Update an agency by ID
router.put('/updateagency/:id', authenticateUserToken, agencyController.updateAgency);

// Delete an agency by ID
router.delete('/deleteagency/:id', authenticateUserToken, agencyController.deleteAgency);

module.exports = router;
