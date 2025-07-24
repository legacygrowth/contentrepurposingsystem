const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyUserController');

// Create a new AgencyUser
router.post('/createagencyuser', agencyController.createAgencyUser);

// Get AgencyUser by ID
router.get('/getagency', agencyController.getAgencyUserById);

// Get all users by Agency ID
router.get('/getAllagency', agencyController.getAgencyUsersByAgencyId);

// Update AgencyUser role by ID
router.put('/updateagencyuser', agencyController.updateAgencyUserRole);

// Delete AgencyUser by ID
router.delete('/deleteagncyuser', agencyController.deleteAgencyUserById);

module.exports = router;
