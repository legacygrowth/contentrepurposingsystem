const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/createcustomer', stripeController.createCustomer);
router.post('/addcard', stripeController.addNewCard);
router.post('/createcharge', stripeController.createCharge);
router.post('/createcheckoutsession', stripeController.createCheckoutSession);
router.post('/createsetupintent', stripeController.createSetupIntent);
router.post('/createpaymentintent', stripeController.createPaymentIntent);
router.get('/callback/success', stripeController.callbackSuccess);
router.get('/callback/error', stripeController.callbackError);


module.exports = router;