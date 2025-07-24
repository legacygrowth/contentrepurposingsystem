


const stripeService = require('../services/stripeService');

// Create Customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, msg: 'Name and email are required' });
        }

        const customer = await stripeService.createCustomer(name, email);
        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Add Card (Attach Payment Method)
exports.addNewCard = async (req, res) => {
    try {
        const { customer_id, payment_method_id } = req.body;

        if (!customer_id || !payment_method_id) {
            return res.status(400).json({ success: false, msg: 'customer_id and payment_method_id are required' });
        }

        const card = await stripeService.addNewCard(customer_id, payment_method_id);
        res.status(200).json({ success: true, card });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Create Charge
exports.createCharge = async (req, res) => {
    try {
        const { customer_id, payment_method_id, amount } = req.body;

        if (!customer_id || !payment_method_id || !amount) {
            return res.status(400).json({ success: false, msg: 'customer_id, payment_method_id and amount are required' });
        }

        const charge = await stripeService.createCharge(customer_id, amount, payment_method_id);
        res.status(200).json({ success: true, charge });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Create Setup Intent Controller (Save Card)
exports.createSetupIntent = async (req, res) => {
    try {
        const { customer_id } = req.body;

        if (!customer_id) {
            return res.status(400).json({ success: false, msg: 'Customer ID is required' });
        }

        const setupIntent = await stripeService.createSetupIntent(customer_id);

        res.status(200).json({
            success: true,
            client_secret: setupIntent.client_secret,
            setupIntent
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({
                success: false,
                message: 'Amount and currency are required'
            });
        }

        const paymentIntent = await stripeService.createPaymentIntent(amount, currency);

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Checkout Session Controller
exports.createCheckoutSession = async (req, res) => {
    try {
        const { product_name, amount, quantity, success_url, cancel_url } = req.body;

        if (!product_name || !amount || !quantity || !success_url || !cancel_url) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }

        const session = await stripeService.createCheckoutSession(product_name, amount, quantity, success_url, cancel_url);

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Success Callback Controller
exports.callbackSuccess = async (req, res) => {
    try {
        const session_id = req.query.session_id; // Optional if you pass session_id in success_url

        const result = await stripeService.callbackSuccess(session_id);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Error / Cancel Callback Controller
exports.callbackError = async (req, res) => {
    try {
        const result = await stripeService.callbackError();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};