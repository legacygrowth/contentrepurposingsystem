const express = require("express");
const router = express.Router();
const paypalService = require("../services/paypalService");
const agencyPaymentModel = require("../models/agencyPayments");


router.post("/pay", async (req, res) => {
  const { amount, currency, description, agencyId } = req.body;

  try {
    const approvalUrl = await paypalService.createPayment(amount, currency, description, agencyId);
    return res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("PayPal payment creation error:", error);
    return res.status(500).json({ error: error?.response || "Payment creation failed" });
  }
});

router.get("/success", async (req, res) => {
  const { paymentId, PayerID, amount, currency, agencyId  } = req.query;

  try {
    const payment = await paypalService.executePayment(paymentId, PayerID, amount, currency);
    
    const paymentRecord = new agencyPaymentModel({
      agencyId,
      amount,
      paymentDate: new Date(),
      paymentGateway: "paypal",
      gatewayResponse: JSON.stringify(payment),
    });

    await paymentRecord.save();
    return res.redirect(`http://localhost:3000/payment-success?&currency=${currency}&amount=${amount}&status=success&agencyId=${agencyId}`);
  } catch (error) {
    console.error("PayPal payment execution error:", error);
    return res.redirect("http://localhost:3000/payment-failure");
  }
});

router.get("/cancel", (req, res) => {
  res.send("Payment cancelled");
});

module.exports = router;
       