 

const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Customer
const createCustomer = async (name, email) => {
    return await stripe.customers.create({ name, email });
};

// Add Card (Attach Payment Method to Customer)
const addNewCard = async (customer_id, payment_method_id) => {
    // Attach payment method
    await stripe.paymentMethods.attach(payment_method_id, {
        customer: customer_id,
    });

    // Make it default
    await stripe.customers.update(customer_id, {
        invoice_settings: {
            default_payment_method: payment_method_id,
        },
    });

    // Retrieve the card details
    const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);

    return {
        card_id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        message: 'Card added successfully'
    };
};

// Create Charge (Payment Intent)
const createCharge = async (customer_id, amount, payment_method_id) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // dollars to cents
        currency: 'usd',
        customer: customer_id,
        payment_method: payment_method_id,
        off_session: true,
        confirm: true
    });

    return paymentIntent;
};


// Create Setup Intent (Save Card for Future Use)
const createSetupIntent = async (customer_id) => {
    const setupIntent = await stripe.setupIntents.create({
        customer: customer_id,
        usage: 'off_session' // For future payments
    });

    return setupIntent;
};


const createPaymentIntent = async (amount, currency) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            }
        });

        return paymentIntent;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createCheckoutSession = async (product_name, amount, quantity, success_url, cancel_url) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product_name,
                },
                unit_amount: amount, // in cents
            },
            quantity: quantity,
        }],
        mode: 'payment',
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,  
        cancel_url: cancel_url,
    });

    return session;
};

const callbackSuccess = async (session_id) => {
    // Normally you would verify session_id or update order status
    // But for now, we return a success message

    return {
        success: true,
        message: 'Payment completed successfully.',
        session_id: session_id || null
    };
};

const callbackError = async () => {
    return {
        success: false,
        message: 'Payment was cancelled or failed.'
    };
};

module.exports = {
    createCustomer,
    addNewCard,
    createCharge,
    createCheckoutSession,
    callbackSuccess,
    callbackError,
    createSetupIntent,
    createPaymentIntent
};
