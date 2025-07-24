const express = require('express');
const router = express.Router();

// Import controller
const userTypesController = require('../controllers/userTypesController');

// Destructure functions
const {
  createUserType,
  getAllUserTypes,
  getUserTypeById,
  updateUserType,
  deleteUserType,
} = userTypesController;

// Define routes using explicit route paths
router.post('/createusertype', createUserType);                  // POST    /api/usertypes/createusertype
router.get('/getallusertypes', getAllUserTypes);                // GET     /api/usertypes/getallusertypes
router.get('/getusertype/:id', getUserTypeById);                // GET     /api/usertypes/getusertype/:id
router.put('/updateusertype/:id', updateUserType);              // PUT     /api/usertypes/updateusertype/:id
router.delete('/deleteusertype/:id', deleteUserType);           // DELETE  /api/usertypes/deleteusertype/:id

module.exports = router;