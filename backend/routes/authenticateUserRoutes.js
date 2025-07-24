const express = require('express');
const router = express.Router();
const userController = require('../controllers/authenticatedUserController');

router.post('/CreateAuthUsers', userController.createUser);
router.get('/getAuthUsers', userController.getUsers);
router.get('/getAuthUsers/:id', userController.getUser);
router.put('/updateAuthUsers/:id', userController.updateUser);
router.delete('/deleteAuthUsers/:id', userController.deleteUser);

module.exports = router;
