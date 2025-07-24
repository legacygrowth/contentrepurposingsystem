const paypal = require("paypal-rest-sdk");
require("dotenv").config();

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const createPayment = async (amount, currency, description, agencyId) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:5000/api/paypal/success?amount=${amount}&currency=${currency}&agencyId=${agencyId}`,
      cancel_url: "http://localhost:5000/api/paypal/cancel",
    },
    transactions: [
      {
        amount: {
          currency,
          total: amount,
        },
        description,
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) return reject(error);
      const approvalUrl = payment.links.find(link => link.rel === "approval_url");
      resolve(approvalUrl.href);
    });
  });
};

const executePayment = async (paymentId, payerId, amount, currency) => {
  const executeData = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency,
          total: amount,
        },
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, executeData, (error, payment) => {
      if (error) return reject(error);
      resolve(payment);
    });
  });
};

module.exports = {
  createPayment,
  executePayment,
};
