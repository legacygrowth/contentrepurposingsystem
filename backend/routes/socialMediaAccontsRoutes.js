const express = require('express');
const router = express.Router();
const socialMediaAccountsController = require('../controllers/socialMediaAccountsController');

 
router.post('/createsocialmedia', socialMediaAccountsController.createSocialMediaAccount);
router.get('/getsocialmedia', socialMediaAccountsController.getSocialMediaAccounts);
router.get('/getsocialmedia/:accountId', socialMediaAccountsController.getSocialMediaAccountById);
router.put('/updatesocialmedia/:accountId', socialMediaAccountsController.updateSocialMediaAccount);
router.delete('/deletesocialmedia/:accountId', socialMediaAccountsController.deleteSocialMediaAccount);

module.exports = router;
