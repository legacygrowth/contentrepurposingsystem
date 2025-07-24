const router = require('express').Router();
const tempUserController = require('../controllers/tempUserController');

router.post('/signup', tempUserController.signup);
router.get('/getUser', tempUserController.getUser);
router.post('/temptoken', tempUserController.registerUserFromToken);

module.exports = router;